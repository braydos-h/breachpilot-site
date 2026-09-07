#!/usr/bin/env bash
# BreachPilot hosted installer — https://breachpilot.dev/install.sh
#
# Clones (or fast-forward updates) the BreachPilot repository, then hands off
# to the repository's own ./install.sh, which installs OS prerequisites, sets
# up Ollama, creates the Python venv, pulls the default models, runs --doctor,
# and installs the `breachpilot` / `bp` launchers.
#
# Quick (pipe into bash):
#     curl -fsSL https://breachpilot.dev/install.sh | bash
#
# Review-first (recommended if you don't pipe URLs into shells):
#     curl -fsSL https://breachpilot.dev/install.sh -o install.sh
#     less install.sh
#     bash install.sh
#
# The repository installer is idempotent and safe to re-run:
#     INSTALL_KALI_TOOLS=1 ./install.sh   # full Kali arsenal (metasploit, exploitdb, ...)
#
# Authorized use only: only test systems you own or have explicit written
# permission to assess.
set -euo pipefail

REPO_URL="${BREACHPILOT_REPO:-https://github.com/braydos-h/BreachPilot}"
DEST="${BREACHPILOT_DIR:-$HOME/BreachPilot}"

have() { command -v "$1" >/dev/null 2>&1; }

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    echo "Usage: bash install.sh [--help]"
    echo "  Env: BREACHPILOT_REPO=<url>  BREACHPILOT_DIR=<path>  (default: \$HOME/BreachPilot)"
    echo "  All other setup flags belong to the repo installer (INSTALL_KALI_TOOLS=1, SKIP_MODEL_PULL=1, ...)."
    exit 0
fi

if ! have git; then
    echo "[!] git is required to fetch BreachPilot. Install it first:" >&2
    echo "    Debian/Ubuntu/Kali: sudo apt-get install -y git" >&2
    echo "    macOS:              brew install git   (or: xcode-select --install)" >&2
    exit 1
fi

if [[ -d "$DEST/.git" ]]; then
    echo "==> Updating existing checkout at $DEST"
    git -C "$DEST" pull --ff-only || echo "  [!] git pull failed — continuing with the existing checkout."
else
    echo "==> Cloning BreachPilot into $DEST"
    git clone --depth 1 "$REPO_URL" "$DEST"
fi

echo "==> Handing off to the repository installer (./install.sh $*)"
cd "$DEST"
exec bash ./install.sh "$@"
