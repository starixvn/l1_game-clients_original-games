const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');
const path = require('path');
const webpack = require('webpack');
const { version } = require('./package.json');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const SEAL_COMPONENT_PROJECT = path.resolve(__dirname, 'dist'); // 打包給 seal-components 外部使用的所有檔案
const SEAL_COMPONENT_OUTPUT = path.resolve(SEAL_COMPONENT_PROJECT, 'dist'); // seal-components 產出檔案

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  // Update the webpack config as needed here.
  if (!config.resolve) {
    config.resolve = {};
  }

  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }

  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, 'src'),
    '@SinglePage': path.resolve(__dirname, 'src/SinglePage'),
    '@InstantPlayDesktop': path.resolve(__dirname, 'src/InstantPlayDesktop'),
    '@InstantPlay': path.resolve(__dirname, 'src/InstantPlay'),
    '@SabaGamesGroup': path.resolve(__dirname, 'src/SabaGamesGroup'),
    '@VGamingGroup': path.resolve(__dirname, 'src/VGamingGroup'),
  };

  config.resolve.extensions = ['.tsx', '.ts', '.js', '.jsx'];

  if (!config.module) {
    config.module = {};
  }

  if (!config.module.rules) {
    config.module.rules = [];
  }

  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
          plugins: [
            '@babel/plugin-transform-runtime',
            '@babel/plugin-transform-react-jsx',
          ],
        },
      },
    },
  ];

  // Add public path configuration
  config.output = {
    ...config.output,
    publicPath: '/nx-app/',
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
  };

  // Add HtmlWebpackPlugin to generate index.html
  if (!config.plugins) {
    config.plugins = [];
  }

  // Remove any existing HtmlWebpackPlugin instances
  config.plugins = config.plugins.filter(
    (plugin) => !(plugin instanceof HtmlWebpackPlugin),
  );

  // Add our configured HtmlWebpackPlugin
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      inject: true,
      publicPath: '/nx-app/',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
  );

  return config;
});
