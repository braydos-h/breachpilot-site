# BreachPilot hosted installer — https://breachpilot.dev/install.ps1
#
# Clones the BreachPilot repository at a pinned STABLE tag by default (or a
# requested -Version / -Channel Edge), then hands off to the repository's own
# install.bat, which checks/installs Python, Node, Nmap and Ollama via
# winget, creates the venv, builds the WebUI, pulls the default models, runs
# --doctor, and installs the `breachpilot` launcher.
#
# Quick (stable, recommended):
#     irm https://breachpilot.dev/install.ps1 | iex
#
# Pin a version:
#     $s = irm https://breachpilot.dev/install.ps1
#     & ([scriptblock]::Create($s)) -Version v0.49.2
#
# Live on the edge (main branch, moves under you):
#     ... | iex  # with $env:BREACHPILOT_CHANNEL = "edge"
#
# Review-first (recommended if you don't pipe URLs into shells):
#     irm https://breachpilot.dev/install.ps1 -OutFile install.ps1
#     Get-Content install.ps1
#     .\install.ps1 -Version v0.49.2
#
# Checksum verification: if the upstream repository publishes
# SHA256SUMS(-signed) release artifacts, verify the checked-out tag against
# them; otherwise an operator-supplied -ExpectedSha256 pin is verified with
# Get-FileHash, and the resolved commit is always printed so the install
# stays auditable. See "Upstream checksums" below for what the main repo must
# publish to enable hard verification.
#
# Authorized use only: only test systems you own or have explicit written
# permission to assess.
[CmdletBinding()]
param(
    [string]$Dir = (Join-Path $HOME "BreachPilot"),
    [string]$Repo = "https://github.com/braydos-h/BreachPilot",
    [string]$Version = $env:BREACHPILOT_VERSION,
    [ValidateSet("stable", "edge")]
    [string]$Channel = $(if ($env:BREACHPILOT_CHANNEL) { $env:BREACHPILOT_CHANNEL } else { "stable" }),
    [string]$ExpectedSha256 = $env:BREACHPILOT_SHA256
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[!] git is required to fetch BreachPilot. Install it first:"
    Write-Host "    winget install Git.Git"
    exit 1
}

if ($Version) { $Channel = "stable" }

function Get-StableTag($RepoUrl) {
    # Newest v* tag by version sort — never a moving branch.
    $tags = git ls-remote --tags --sort='-v:refname' $RepoUrl 'v*.*' | Select-String -NotMatch '\^\{\}' | Select-Object -First 1
    if (-not $tags) { return $null }
    return ($tags.ToString() -replace '.*refs/tags/', '')
}

if ($Channel -eq "edge") {
    $RefDesc = "main branch tip (edge — moves with upstream)"
    $CheckoutRef = $null
} else {
    $Tag = if ($Version) { $Version } else { Get-StableTag $Repo }
    if (-not $Tag) {
        Write-Host "[!] could not resolve a stable tag from $Repo"
        exit 1
    }
    $RefDesc = "stable tag $Tag"
    $CheckoutRef = $Tag
}

if (Test-Path (Join-Path $Dir ".git")) {
    Write-Host "==> Existing checkout at $Dir — fetching $RefDesc"
    git -C $Dir fetch --tags origin
    if ($CheckoutRef) {
        git -C $Dir checkout -q $CheckoutRef
        git -C $Dir reset -q --hard $CheckoutRef
    } else {
        git -C $Dir checkout -q main
        try { git -C $Dir pull --ff-only } catch { Write-Host "  [!] git pull failed — continuing with the existing checkout." }
    }
} else {
    Write-Host "==> Cloning BreachPilot ($RefDesc) into $Dir"
    if ($CheckoutRef) {
        git clone --depth 1 --branch $CheckoutRef $Repo $Dir
    } else {
        git clone --depth 1 --branch main $Repo $Dir
    }
}

$Resolved = (git -C $Dir rev-parse HEAD).Trim()
Write-Host "==> Installed ref: $(if ($CheckoutRef) { $CheckoutRef } else { 'main' }) @ $Resolved"

# --- Optional checksum verification -------------------------------------
# Upstream checksums: for hard verification the main BreachPilot repository
# must publish, per release tag, a SHA256SUMS file (ideally detached-signed
# as SHA256SUMS.asc) covering the release tarball, e.g. at:
#   https://github.com/braydos-h/BreachPilot/releases/download/<tag>/SHA256SUMS
# Until then this block verifies an operator-supplied pin (-ExpectedSha256 /
# $env:BREACHPILOT_SHA256) via Get-FileHash over `git archive` of the
# resolved commit, and always prints the resolved SHA so the install is
# auditable.
if ($ExpectedSha256) {
    $tmp = Join-Path ([System.IO.Path]::GetTempPath()) "breachpilot-pin.tar"
    git -C $Dir archive $Resolved --output $tmp
    $Actual = (Get-FileHash -Path $tmp -Algorithm SHA256).Hash.ToLower()
    Remove-Item $tmp -Force -ErrorAction SilentlyContinue
    if ($Actual -ne $ExpectedSha256.ToLower()) {
        Write-Host "[!] checksum mismatch for commit $Resolved"
        Write-Host "    expected: $ExpectedSha256"
        Write-Host "    actual:   $Actual"
        exit 1
    }
    Write-Host "==> Checksum OK (operator pin): $Actual"
} else {
    Write-Host "    (no -ExpectedSha256 pin set — upstream SHA256SUMS not yet published; skipping hard verification)"
}

Write-Host "==> Handing off to the repository installer (install.bat)"
Push-Location $Dir
try {
    & .\install.bat
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
