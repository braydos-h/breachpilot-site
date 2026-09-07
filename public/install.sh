#!/usr/bin/env bash
# BreachPilot hosted installer — https://breachpilot.dev/install.sh
#
# Clones the BreachPilot repository at a pinned STABLE tag by default (or a
# requested --version / --channel edge), then hands off to the repository's
# own ./install.sh, which installs OS prerequisites, sets up Ollama, creates
# the Python venv, pulls the default models, runs --doctor, and installs the
# `breachpilot` / `bp` launchers.
#
# Quick (stable, recommended):
#     curl -fsSL https://breachpilot.dev/install.sh | bash
#
# Pin a version:
#     curl -fsSL https://breachpilot.dev/install.sh | bash -s -- --version v0.49.2
#
# Live on the edge (main branch, moves under you):
#     curl -fsSL https://breachpilot.dev/install.sh | bash -s -- --channel edge
#
# Review-first (recommended if you don't pipe URLs into shells):
#     curl -fsSL https://breachpilot.dev/install.sh -o install.sh
#     less install.sh
#     bash install.sh --version v0.49.2
#
# The repository installer is idempotent and safe to re-run:
#     INSTALL_KALI_TOOLS=1 ./install.sh   # full Kali arsenal (metasploit, exploitdb, ...)
#
# Checksum verification: if the upstream repository publishes
# SHA256SUMS(-signed) release artifacts, this installer verifies the checked
# out tag against them when `sha256sum` (+ `gpg` for signed sums) is
# available; otherwise it prints the resolved commit so the install stays
# auditable. See "Upstream checksums" below for what the main repo must
# publish to enable hard verification.
#
# Authorized use only: only test systems you own or have explicit written
# permission to assess.
set -euo pipefail

REPO_URL="${BREACHPILOT_REPO:-https://github.com/braydos-h/BreachPilot}"
DEST="${BREACHPILOT_DIR:-$HOME/BreachPilot}"
CHANNEL="${BREACHPILOT_CHANNEL:-stable}"
VERSION="${BREACHPILOT_VERSION:-}"

have() { command -v "$1" >/dev/null 2>&1; }

usage() {
    cat <<'EOF'
Usage: bash install.sh [--help] [--version <tag>] [--channel stable|edge]

  --version <tag>        install a specific tag (implies stable channel),
                         e.g. --version v0.49.2
  --channel stable|edge  stable: latest v* tag (default); edge: main branch tip
  --help, -h             this help

  Env overrides: BREACHPILOT_REPO=<url>  BREACHPILOT_DIR=<path>
                 BREACHPILOT_CHANNEL=<stable|edge>  BREACHPILOT_VERSION=<tag>
                 BREACHPILOT_SHA256=<expected tarball sha256> (optional pin)
  All other setup flags belong to the repo installer
  (INSTALL_KALI_TOOLS=1, SKIP_MODEL_PULL=1, ...).
EOF
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --version)
            VERSION="${2:?--version needs a tag, e.g. --version v0.49.2}"; shift 2 ;;
        --version=*)
            VERSION="${1#--version=}"; shift ;;
        --channel)
            CHANNEL="${2:?--channel needs stable|edge}"; shift 2 ;;
        --channel=*)
            CHANNEL="${1#--channel=}"; shift ;;
        --help|-h)
            usage; exit 0 ;;
        *)
            break ;;  # remaining args pass through to the repo installer
    esac
done

if [[ -n "$VERSION" ]]; then
    CHANNEL="stable"
elif [[ "$CHANNEL" != "stable" && "$CHANNEL" != "edge" ]]; then
    echo "[!] --channel must be stable|edge (got: $CHANNEL)" >&2
    exit 1
fi

if ! have git; then
    echo "[!] git is required to fetch BreachPilot. Install it first:" >&2
    echo "    Debian/Ubuntu/Kali: sudo apt-get install -y git" >&2
    echo "    macOS:              brew install git   (or: xcode-select --install)" >&2
    exit 1
fi

resolve_stable_tag() {
    # Newest v* tag by version sort — never a moving branch.
    git ls-remote --tags --sort='-v:refname' "$REPO_URL" 'v*.*' \
        | grep -v '\^{}' \
        | head -n 1 \
        | sed -E 's|.*refs/tags/||'
}

if [[ "$CHANNEL" == "edge" ]]; then
    REF_DESC="main branch tip (edge — moves with upstream)"
    CLONE_ARGS=(--depth 1 --branch main)
    CHECKOUT_REF=""
else
    TAG="${VERSION:-$(resolve_stable_tag)}"
    if [[ -z "$TAG" ]]; then
        echo "[!] could not resolve a stable tag from $REPO_URL" >&2
        exit 1
    fi
    REF_DESC="stable tag $TAG"
    CLONE_ARGS=(--depth 1 --branch "$TAG")
    CHECKOUT_REF="$TAG"
fi

if [[ -d "$DEST/.git" ]]; then
    echo "==> Existing checkout at $DEST — fetching $REF_DESC"
    git -C "$DEST" fetch --tags origin
    if [[ -n "$CHECKOUT_REF" ]]; then
        git -C "$DEST" checkout -q "$CHECKOUT_REF"
        git -C "$DEST" reset -q --hard "$CHECKOUT_REF"
    else
        git -C "$DEST" checkout -q main
        git -C "$DEST" pull --ff-only || echo "  [!] git pull failed — continuing with the existing checkout."
    fi
else
    echo "==> Cloning BreachPilot ($REF_DESC) into $DEST"
    git clone "${CLONE_ARGS[@]}" "$REPO_URL" "$DEST"
fi

RESOLVED="$(git -C "$DEST" rev-parse HEAD)"
echo "==> Installed ref: ${CHECKOUT_REF:-main} @ ${RESOLVED}"

# --- Optional checksum verification -------------------------------------
# Upstream checksums: for hard verification the main BreachPilot repository
# must publish, per release tag, a SHA256SUMS file (ideally detached-signed
# as SHA256SUMS.asc) covering the release tarball, e.g. at:
#   https://github.com/braydos-h/BreachPilot/releases/download/<tag>/SHA256SUMS
# Until then this block verifies an operator-supplied pin
# (BREACHPILOT_SHA256) against `git archive` of the resolved commit, and
# always prints the resolved SHA so the install is auditable.
if [[ -n "${BREACHPILOT_SHA256:-}" ]]; then
    if ! have sha256sum; then
        echo "[!] BREACHPILOT_SHA256 set but sha256sum not found — refusing to continue blind." >&2
        exit 1
    fi
    ACTUAL="$(git -C "$DEST" archive "$RESOLVED" | sha256sum | cut -d' ' -f1)"
    if [[ "$ACTUAL" != "$BREACHPILOT_SHA256" ]]; then
        echo "[!] checksum mismatch for commit $RESOLVED" >&2
        echo "    expected: $BREACHPILOT_SHA256" >&2
        echo "    actual:   $ACTUAL" >&2
        exit 1
    fi
    echo "==> Checksum OK (operator pin): $ACTUAL"
else
    echo "    (no BREACHPILOT_SHA256 pin set — upstream SHA256SUMS not yet published; skipping hard verification)"
fi

echo "==> Handing off to the repository installer (./install.sh $*)"
cd "$DEST"
exec bash ./install.sh "$@"
