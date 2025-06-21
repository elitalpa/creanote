/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/plausible/js/script.js",
        destination: "https://plausible.io/js/script.js",
      },
      {
        source: "/plausible/api/event",
        destination: "https://plausible.io/api/event",
      },
    ];
  },
};

export default nextConfig;
