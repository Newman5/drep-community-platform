import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Server external packages for both webpack and turbopack
  serverExternalPackages: [
    '@sidan-lab/whisky-js-nodejs',
    '@meshsdk/core-csl'
  ],
  
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    
    // Handle .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    return config;
  },
};

export default nextConfig;
