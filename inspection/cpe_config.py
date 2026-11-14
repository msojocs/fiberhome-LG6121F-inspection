"""Load local settings shared by the CPE inspection tools."""
import json
from pathlib import Path


CONFIG_PATH = Path(__file__).with_name("config.json")
EXAMPLE_PATH = Path(__file__).with_name("config.example.json")


def load_config(*required_keys):
    try:
        config = json.loads(CONFIG_PATH.read_text())
    except FileNotFoundError:
        raise SystemExit(
            f"Missing {CONFIG_PATH}. Copy {EXAMPLE_PATH} and fill in local values.")
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid JSON in {CONFIG_PATH}: {exc}") from exc

    if not isinstance(config, dict):
        raise SystemExit(f"{CONFIG_PATH} must contain a JSON object.")

    missing = [key for key in required_keys
               if not isinstance(config.get(key), str) or not config[key].strip()]
    if missing:
        raise SystemExit(
            f"Missing or empty string settings in {CONFIG_PATH}: {', '.join(missing)}")
    return config
