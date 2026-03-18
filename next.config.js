/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@vercel/postgres'],
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
}

module.exports = nextConfig
