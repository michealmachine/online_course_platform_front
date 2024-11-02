/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  typescript: {
    // !! 警告 !!
    // 在生产环境中禁用类型检查可能会导致潜在的运行时错误
    ignoreBuildErrors: true,
  },
  eslint: {
    // 同时建议禁用 ESLint，因为它可能也会执行一些类型检查
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 