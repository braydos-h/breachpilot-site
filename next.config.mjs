/** @type {import("next").NextConfig} */
const nextConfig = {
  // Static export: breachpilot.dev serves pre-rendered HTML + public/ assets.
  // Installer files live in public/install.sh + public/install.ps1 and are
  // served verbatim (no rewrites) — see DEPLOY.md for header/CDN notes.
  output: "export",
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
