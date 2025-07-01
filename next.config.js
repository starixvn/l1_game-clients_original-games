/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // SWC Configuration to replace Babel
  compiler: {
    // Enable decorators and class properties
    decorators: {
      legacy: true,
    },
  },
  sassOptions: {
    includePaths: ["./src/styles", "./src"],
  },
  webpack: (config, { isServer }) => {
    // Ensure reflect-metadata is loaded first in the main entry
    if (typeof config.entry === "function") {
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        if (
          entries["main.js"] &&
          !entries["main.js"].includes("reflect-metadata")
        ) {
          entries["main.js"].unshift("reflect-metadata");
        }
        return entries;
      };
    }
    // Existing alias for reflect-metadata
    config.resolve.alias = {
      ...config.resolve.alias,
      "reflect-metadata": require.resolve("reflect-metadata"),
    };
    // Handle Node.js polyfills for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        url: require.resolve("url"),
        zlib: require.resolve("browserify-zlib"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        assert: require.resolve("assert"),
        os: require.resolve("os-browserify/browser"),
        path: require.resolve("path-browserify"),
        buffer: require.resolve("buffer"),
        process: require.resolve("process/browser"),
        util: require.resolve("util"),
      };
      config.plugins.push(
        new (require("webpack").ProvidePlugin)({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        })
      );
    }
    // Handle SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    // Handle audio files
    config.module.rules.push({
      test: /\.(wav|mp3|ogg|m4a)$/,
      type: "asset/resource",
    });
    return config;
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  images: {
    domains: ["localhost"],
    unoptimized: true, // For static export if needed
  },
  // Handle static assets
  assetPrefix: process.env.NODE_ENV === "production" ? "" : "",
  trailingSlash: false,
  // Enable static export if needed
  output: "standalone",
  // distDir: 'dist',
};

module.exports = nextConfig;
