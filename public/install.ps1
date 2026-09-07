# BreachPilot hosted installer — https://breachpilot.dev/install.ps1
#
# Clones (or fast-forward updates) the BreachPilot repository, then hands off
# to the repository's own install.bat, which checks/installs Python, Node,
# Nmap and Ollama via winget, creates the venv, builds the WebUI, pulls the
# default models, runs --doctor, and installs the `breachpilot` launcher.
#
# Quick:
#     irm https://breachpilot.dev/install.ps1 | iex
#
# Review-first (recommended if you don't pipe URLs into shells):
#     irm https://breachpilot.dev/install.ps1 -OutFile install.ps1
#     Get-Content install.ps1
#     .\install.ps1
#
# Authorized use only: only test systems you own or have explicit written
# permission to assess.
[CmdletBinding()]
param(
    [string]$Dir = (Join-Path $HOME "BreachPilot"),
    [string]$Repo = "https://github.com/braydos-h/BreachPilot"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[!] git is required to fetch BreachPilot. Install it first:"
    Write-Host "    winget install Git.Git"
    exit 1
}

if (Test-Path (Join-Path $Dir ".git")) {
    Write-Host "==> Updating existing checkout at $Dir"
    try { git -C $Dir pull --ff-only } catch { Write-Host "  [!] git pull failed — continuing with the existing checkout." }
} else {
    Write-Host "==> Cloning BreachPilot into $Dir"
    git clone --depth 1 $Repo $Dir
}

Write-Host "==> Handing off to the repository installer (install.bat)"
Push-Location $Dir
try {
    & .\install.bat
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
