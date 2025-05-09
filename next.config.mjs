/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: false,
  trailingSlash: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: "@svgr/webpack", options: { icon: "100%" } }],
    });
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config;
  },
};

export default nextConfig;
