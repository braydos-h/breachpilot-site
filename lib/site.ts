export const SITE = {
  name: "BreachPilot",
  tagline: "Autonomous security assessment. Operator supervised.",
  pipeline: "Plan · Recon · Exploit · Verify · Report",
  description:
    "BreachPilot is an open-source, local-first platform for authorized security testing. It plans the assessment, runs recon, checks each finding against evidence, and writes the report.",
  url: "https://breachpilot.dev",
  repo: "https://github.com/braydos-h/BreachPilot",
  license: "Apache-2.0",
  installSh: "https://breachpilot.dev/install.sh",
  installPs1: "https://breachpilot.dev/install.ps1",
  webuiDefaultPort: 8765,
} as const;

export type NavLink = { href: string; label: string };

export const NAV_LINKS: NavLink[] = [
  { href: "/features", label: "Features" },
  { href: "/architecture", label: "Architecture" },
  { href: "/install", label: "Install" },
  { href: "/releases", label: "Releases" },
  { href: "/docs", label: "Docs" },
  { href: "/safety", label: "Safety" },
];

export const FOOTER_COLS: Array<{ title: string; links: NavLink[] }> = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/install", label: "Install" },
      { href: "/architecture", label: "Architecture" },
      { href: "/benchmarks", label: "Benchmarks" },
      { href: "/safety", label: "Safety" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/docs/api/overview", label: "API" },
      { href: "/plugins", label: "Plugins" },
      { href: "/contributing", label: "Contributing" },
      { href: SITE.repo, label: "GitHub" },
    ],
  },
  {
    title: "Project",
    links: [
      { href: SITE.repo, label: "Repository" },
      { href: `${SITE.repo}/blob/main/LICENSE`, label: "License" },
      { href: `${SITE.repo}/releases`, label: "Releases" },
      { href: `${SITE.repo}/issues`, label: "Issues" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/security", label: "Security" },
      { href: "/legal", label: "Legal" },
    ],
  },
];

export const SWARM_AGENTS = [
  { id: "recon", name: "Recon", job: "Attack-surface discovery and fingerprinting", icon: "Radar" },
  { id: "vuln", name: "Vuln", job: "Vulnerability / CVE and module correlation", icon: "Search" },
  { id: "exploit", name: "Exploit", job: "Capability selection, payload work and execution", icon: "Zap" },
  { id: "post_exploit", name: "Post Exploit", job: "Credential, loot and lateral-target handling", icon: "KeyRound" },
  { id: "critic", name: "Critic", job: "Scope, risk and policy review", icon: "ShieldCheck" },
  { id: "reflection", name: "Reflection", job: "Strategy review and lessons", icon: "Brain" },
] as const;

export type PluginInfo = { name: string; purpose: string; needsCredentials: boolean };

export const PLUGINS: PluginInfo[] = [
  { name: "shodan_recon", purpose: "Passive Shodan OSINT for port, banner and CVE context without touching the target. Advisory-only.", needsCredentials: true },
  { name: "github_dorks", purpose: "Authorized-target code-leak discovery via GitHub Code Search. Finds leaked credentials in the target org's public repos, pre-recon. Advisory-only.", needsCredentials: true },
  { name: "webhook_notify", purpose: "Outbound-only Slack / Discord run-status notifications on milestones and findings.", needsCredentials: true },
  { name: "sliver_c2", purpose: "Sliver C2 bridge for implant generation, team server and session management.", needsCredentials: true },
  { name: "bloodhound_ce", purpose: "BloodHound CE data exchange for AD attack-path ingest and query.", needsCredentials: true },
  { name: "zap_scan", purpose: "OWASP ZAP REST integration with spider plus active scan for authenticated web targets.", needsCredentials: true },
  { name: "browser_attack", purpose: "Headless Chromium / Playwright driver for authenticated web testing and XSS-hunter callbacks.", needsCredentials: false },
  { name: "mobile_attack", purpose: "Mobile testing with Frida, objection, apktool and jadx for local APK analysis and device instrumentation.", needsCredentials: false },
  { name: "wireless", purpose: "Wireless / Bluetooth assessment with bettercap, aircrack-ng, hcxtools and bluez for authorized WLAN / BT testing.", needsCredentials: false },
  { name: "spiderfoot", purpose: "SpiderFoot OSINT integration (passive) covering DNS, whois, certificates and leaks in one tool.", needsCredentials: true },
  { name: "atomic_red_team", purpose: "Atomic Red Team test YAML generator mapping weaknesses to MITRE ATT&CK techniques for detection validation. Local-only, no execution.", needsCredentials: false },
  { name: "caldera", purpose: "MITRE Caldera adversary-emulation plugin running abilities against an authorized Caldera server.", needsCredentials: true },
  { name: "firmware_analysis", purpose: "Firmware analysis with binwalk, firmadyne, FACT-extractor and EMUX for IoT firmware unpacking and emulation.", needsCredentials: false },
  { name: "snmp", purpose: "SNMP enumeration for system inventory, users, processes and community-string checks.", needsCredentials: false },
];

export const PROVIDERS = [
  {
    id: "ollama",
    name: "Ollama / Ollama Cloud",
    desc: "Default chat/generate path: a cloud endpoint with bearer key, or a local daemon. Handles context-window translation and the model catalog sync.",
    config: "ollama.host · ollama.model glm-5.2:cloud · ollama.embed_host",
    auth: "OLLAMA_API_KEY (environment only, never in config)",
  },
  {
    id: "opencode_go",
    name: "OpenCode Go",
    desc: "OpenAI Responses API over HTTPS. Model discovery from the provider's /models endpoint with caching.",
    config: "providers.opencode_go · base_url https://opencode.ai/zen/go/v1",
    auth: "OPENCODE_GO_API_KEY (environment only)",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    desc: "Opt-in route via the vendored oauth/ loopback proxy, backed by browser OAuth. Tokens stay in the OAuth store.",
    config: "models.provider: chatgpt · loopback 127.0.0.1:10531",
    auth: "~/.codex/auth.json (existence-checked only, never read into config)",
  },
] as const;
