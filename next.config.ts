import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      // ...
    },
  },
  swcMinify: true, // Enable SWC-based minification for faster builds
  webpack: (config, { isServer }) => {
    // Custom Webpack configuration, if required
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, // Example: Avoid using `fs` on the client side
      };
    }
    return config;
  },
};

 
export default nextConfig