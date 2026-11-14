"""Temporary Telnet access using credentials from the local config.json."""
import re
import uuid

import pexpect

from cpe_config import load_config


class Shell:
    def __init__(self):
        config = load_config(
            "device_host", "admin_username", "admin_password", "root_password")
        self.p = pexpect.spawn("telnet", [config["device_host"]], encoding="utf-8",
                               codec_errors="replace", timeout=15, echo=False,
                               dimensions=(40, 300))
        self.p.expect(r"(?i)login:")
        self.p.sendline(config["admin_username"])
        self.p.expect(r"(?i)password:")
        self.p.sendline(config["admin_password"])
        self.p.expect(r"(?m)[^\r\n]*[$#>] ?$")
        self.p.sendline("su root")
        self.p.expect(r"(?i)password:")
        self.p.sendline(config["root_password"])
        self.p.expect(r"(?m)[^\r\n]*# ?$")
        self.p.sendline("stty -echo; export HISTFILE=/dev/null; export PS1='CPE_INSPECT> '")
        self.p.expect(r"\r?\nCPE_INSPECT> $")

    def run(self, command, timeout=30):
        marker = "CPE_DONE_" + uuid.uuid4().hex
        self.p.sendline(command + "; cpe_rc=$?; printf '\\n" + marker + ":%s\\n' \"$cpe_rc\"")
        self.p.expect(re.escape(marker) + r":(\d+)\r?\n", timeout=timeout)
        result = self.p.before.replace("\r\n", "\n").replace("\r", "")
        code = int(self.p.match.group(1))
        self.p.expect_exact("CPE_INSPECT> ")
        return code, result

    def close(self):
        self.p.sendline("exit")
        self.p.close(force=True)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("command")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    shell = Shell()
    try:
        status, output = shell.run(args.command)
        if args.output:
            args.output.parent.mkdir(parents=True, exist_ok=True)
            args.output.write_text(output)
        else:
            print(output, end="")
        raise SystemExit(status)
    finally:
        shell.close()
