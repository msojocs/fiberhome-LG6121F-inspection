"""Read all MTD partitions with nanddump; stream backups to this PC.

Images contain ECC-corrected page data plus the OOB exposed by the MTD driver.
No erase, write, unlock, reboot, or slot-selection operations are performed.
"""
import hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import re
import secrets
import shlex
import threading
import time

from cpe_config import load_config
from cpe_shell import Shell

os.umask(0o077)
CONFIG = load_config("device_host", "backup_host", "backup_dir")
DEVICE_HOST = CONFIG["device_host"]
BACKUP_HOST = CONFIG["backup_host"]
ROOT = Path(CONFIG["backup_dir"]).expanduser()
if not ROOT.is_absolute():
    ROOT = Path(__file__).parent / ROOT
ROOT = ROOT.resolve()
IMAGE_DIR = ROOT / "images"
IMAGE_DIR.mkdir(exist_ok=True)
LOG_DIR = ROOT / "dump-logs"
LOG_DIR.mkdir(exist_ok=True)
TOKEN = secrets.token_hex(24)
records = {}
expected = {}


class Receiver(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, *args):
        pass

    def do_PUT(self):
        name = self.path.lstrip("/")
        if (self.client_address[0] != DEVICE_HOST or
                self.headers.get("X-Audit-Token") != TOKEN or name not in expected):
            self.send_error(403)
            return
        target = IMAGE_DIR / name
        partial = target.with_suffix(target.suffix + ".partial")
        digest = hashlib.sha256()
        size = 0
        self.connection.settimeout(60)
        try:
            with partial.open("wb") as out:
                if self.headers.get("Transfer-Encoding", "").lower() == "chunked":
                    while True:
                        line = self.rfile.readline(256)
                        if not line:
                            raise ValueError("Unexpected EOF in chunk header")
                        count = int(line.split(b";", 1)[0], 16)
                        if count == 0:
                            while self.rfile.readline(8192) not in (b"\r\n", b"\n", b""):
                                pass
                            break
                        while count:
                            chunk = self.rfile.read(min(count, 1024 * 1024))
                            if not chunk:
                                raise ValueError("Unexpected EOF in chunk body")
                            count -= len(chunk)
                            size += len(chunk)
                            if size > expected[name]:
                                raise ValueError("Image exceeds expected partition size")
                            out.write(chunk)
                            digest.update(chunk)
                        if self.rfile.read(2) != b"\r\n":
                            raise ValueError("Invalid chunk delimiter")
                else:
                    count = int(self.headers["Content-Length"])
                    while count:
                        chunk = self.rfile.read(min(count, 1024 * 1024))
                        if not chunk:
                            raise ValueError("Unexpected EOF")
                        count -= len(chunk)
                        size += len(chunk)
                        if size > expected[name]:
                            raise ValueError("Image exceeds expected partition size")
                        out.write(chunk)
                        digest.update(chunk)
                if size != expected[name]:
                    raise ValueError(f"Size mismatch: {size} != {expected[name]}")
                out.flush()
                os.fsync(out.fileno())
            partial.replace(target)
            records[name] = {"size": size, "sha256": digest.hexdigest()}
            response = b"OK\n"
            self.send_response(200)
            self.send_header("Content-Length", str(len(response)))
            self.end_headers()
            self.wfile.write(response)
        except Exception as exc:
            records[name] = {"error": str(exc)}
            self.send_error(500)


def split_image(path, page_size, oob_size):
    """Derive data-only and OOB-only files without changing physical page order."""
    if path.name.endswith(".ecc-oob.bin"):
        stem = path.name.removesuffix(".ecc-oob.bin")
        variant = ""
    else:
        stem = path.name.removesuffix(".raw-oob.bin")
        variant = ".raw"
    outputs = [IMAGE_DIR / (stem + variant + ".data.bin"),
               IMAGE_DIR / (stem + variant + ".oob.bin")]
    hashes = [hashlib.sha256(), hashlib.sha256()]
    with path.open("rb") as src, outputs[0].open("wb") as main, outputs[1].open("wb") as oob:
        while page := src.read(page_size + oob_size):
            if len(page) != page_size + oob_size:
                raise ValueError("Truncated NAND page")
            for out, digest, chunk in zip((main, oob), hashes, (page[:page_size], page[page_size:])):
                out.write(chunk)
                digest.update(chunk)
    return [{"file": str(p.relative_to(ROOT)), "size": p.stat().st_size,
             "sha256": h.hexdigest()} for p, h in zip(outputs, hashes)]


def main():
    sysfs = (ROOT / "metadata/mtd-sysfs.txt").read_text()
    partitions = []
    for match in re.finditer(r"^MTD (mtd\d+)\n(.*?)(?=^MTD |\Z)", sysfs, re.M | re.S):
        row = dict(re.findall(r"^(\w+)=(.*)$", match[2], re.M))
        row["device"] = match[1]
        for key in ("size", "writesize", "oobsize", "erasesize", "bad_blocks", "ecc_failures"):
            row[key] = int(row[key])
        partitions.append(row)
    partitions.sort(key=lambda row: int(row["device"][3:]))
    if len(partitions) != 49:
        raise ValueError(f"Unexpected partition count: {len(partitions)}")
    manifest_path = ROOT / "manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {
        "host": DEVICE_HOST, "method": "nanddump --oob --bb=padbad on /dev/mtdN (read-only open)",
        "consistency": "Live per-partition capture; writable filesystems are not atomic snapshots.",
        "partitions": []}
    server = ThreadingHTTPServer((BACKUP_HOST, 0), Receiver)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    shell = Shell()
    remote_dir = "/tmp/cpe-backup-" + secrets.token_hex(6)
    setup_code, _ = shell.run(f"mkdir -m 700 {remote_dir} && mkfifo {remote_dir}/hashfifo")
    if setup_code:
        raise RuntimeError("Could not create RAM-only transfer workspace")
    def capture(part, name, options, log_name):
        expected[name] = part["size"] // part["writesize"] * (part["writesize"] + part["oobsize"])
        source = f"/dev/{part['device']}"
        url = f"http://{BACKUP_HOST}:{server.server_port}/{name}"
        print(f"Reading {part['device']} {part['name']} ({log_name}): "
              f"{part['size'] // 1024} KiB", flush=True)
        started = time.time()
        cmd = (
            f"(set -o pipefail; sha256sum < {remote_dir}/hashfifo > {remote_dir}/hash & cpe_hash_pid=$!; "
            f"nanddump {options} {source} 2>{remote_dir}/nand.log | "
            f"tee {remote_dir}/hashfifo | curl --noproxy '*' -fsS --connect-timeout 5 --max-time 600 "
            f"-H {shlex.quote('X-Audit-Token: ' + TOKEN)} --upload-file - {shlex.quote(url)}; "
            f"cpe_dump_rc=$?; wait $cpe_hash_pid; cpe_hash_rc=$?; cat {remote_dir}/hash; "
            f"cat {remote_dir}/nand.log; [ $cpe_hash_rc -eq 0 ] || exit $cpe_hash_rc; exit $cpe_dump_rc)"
        )
        status, output = shell.run(cmd, timeout=660)
        (LOG_DIR / log_name).write_text(output)
        remote_hash = re.search(r"(?m)^([0-9a-f]{64})\s+-\s*$", output)
        received = records.get(name, {})
        if status or not remote_hash or remote_hash[1] != received.get("sha256"):
            raise RuntimeError(f"Backup verification failed for {part['device']}: "
                               f"exit={status}, received={received}")
        return received, remote_hash[1], output, started

    try:
        for part in partitions:
            if any(p["device"] == part["device"] for p in manifest["partitions"]):
                continue
            name = f"{part['device']}-{part['name']}.ecc-oob.bin"
            received, device_hash, output, started = capture(
                part, name, "--oob --bb=padbad", part["device"] + ".txt")
            derived = split_image(IMAGE_DIR / name, part["writesize"], part["oobsize"])
            row = {**part, "image": "images/" + name, **received,
                   "device_sha256": device_hash, "derived": derived,
                   "captured_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
                   "duration_seconds": round(time.time() - started, 2)}
            # Preserve partition capacity separately from the interleaved image size.
            row["partition_size"] = part["size"]
            ecc_errors = re.findall(r"(?m)^ECC: .*uncorrectable.*$", output, re.I)
            if ecc_errors:
                # Preserve both views: ECC mode reports data integrity, while no-ECC
                # mode captures vendor regions that may intentionally lack valid ECC.
                row["ecc_errors"] = ecc_errors
                raw_name = f"{part['device']}-{part['name']}.raw-oob.bin"
                raw_received, raw_device_hash, raw_output, _ = capture(
                    part, raw_name, "--noecc --oob --bb=padbad", part["device"] + ".raw.txt")
                if re.search(r"Input/output error", raw_output, re.I):
                    raise RuntimeError(f"Raw read errors reported for {part['device']}; inspect log")
                row.update({"raw_image": "images/" + raw_name,
                            "raw_size": raw_received["size"],
                            "raw_sha256": raw_received["sha256"],
                            "raw_device_sha256": raw_device_hash,
                            "raw_derived": split_image(IMAGE_DIR / raw_name,
                                                       part["writesize"], part["oobsize"])})
                print(f"WARNING {part['device']}: {len(ecc_errors)} ECC errors; raw backup verified",
                      flush=True)
            manifest["partitions"].append(row)
            manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
            print(f"Verified {part['device']}: {received['size']} bytes, SHA256 matches", flush=True)
        checksums = []
        for part in manifest["partitions"]:
            checksums.append(f"{part['sha256']}  {part['image']}")
            checksums.extend(f"{x['sha256']}  {x['file']}" for x in part["derived"])
            if "raw_image" in part:
                checksums.append(f"{part['raw_sha256']}  {part['raw_image']}")
                checksums.extend(f"{x['sha256']}  {x['file']}" for x in part["raw_derived"])
        (ROOT / "SHA256SUMS").write_text("\n".join(checksums) + "\n")
        print(f"Completed {len(manifest['partitions'])} partitions: {ROOT}", flush=True)
    finally:
        try:
            shell.run(f"rm -f {remote_dir}/hashfifo {remote_dir}/hash {remote_dir}/nand.log; rmdir {remote_dir}")
        finally:
            shell.close()
            server.shutdown()
            server.server_close()


if __name__ == "__main__":
    main()
