const { resolve } = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const { version } = require('./package.json');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const VS_COMPONENT_WORKING_DIR = resolve(
  __dirname,
  '../../libs/virtual-sport/src'
);
const VSP_COMPONENT_WORKING_DIR = resolve(
  __dirname,
  '../../libs/virtual-sport-push/src'
);
const NG_COMPONENT_WORKING_DIR = resolve(
  __dirname,
  '../../libs/number-game/src'
);

const SEAL_COMPONENT_PROJECT = resolve(__dirname, 'dist'); // 打包給 seal-components 外部使用的所有檔案
const SEAL_COMPONENT_OUTPUT = resolve(SEAL_COMPONENT_PROJECT, 'dist'); // seal-components 產出檔案

module.exports = {
  mode: 'production',
  entry: resolve(__dirname, 'src/index.ts'),
  // 只顯示錯誤訊息
  stats: 'errors-only',
  output: {
    path: SEAL_COMPONENT_OUTPUT,
    filename: 'seal-components.js',
    library: 'SealComponents',
    libraryTarget: 'umd'
  },
  devtool: false,
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@virtualSport': VS_COMPONENT_WORKING_DIR,
      '@virtualSportPush': VSP_COMPONENT_WORKING_DIR,
      '@numberGame': NG_COMPONENT_WORKING_DIR,
      '@SinglePage': resolve(
        __dirname,
        '../../libs/single-page/src/main.tsx'
      ),
      '@InstantPlayDesktop': resolve(
        __dirname,
        '../../libs/instant-play-desktop/src/index.tsx'
      ),
      '@InstantPlay': resolve(
        __dirname,
        '../../libs/instant-play/index.js'
      ),
      "@seal-components/components-styles": resolve(__dirname, "../../libs/components-styles"),
      "@seal-components/translation": resolve(__dirname, "../../libs/translation/src"),
      "@video-player": resolve(__dirname, "../../libs/video-player/src/index"),
      "@SabaGamesGroup" : resolve(__dirname, "../../libs/saba-games/src/index.tsx"),
      "@VGamingGroup": resolve(__dirname, "../../libs/vgaming/src/index.tsx"),
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        },
        exclude: [
          /node_modules/,
          /libs\/saba-games\/preview-template/
        ]
      },
      {
        test: /\.module\.(css|scss|sass)$/,
        exclude: [
          /node_modules/,
          /libs\/saba-games\/preview-template/
        ],
        rules: [
          {
            use: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              // CSS Modules https://github.com/css-modules/css-modules
              modules: {
                localIdentName: '[hash:base64:5]'
              }
            }
          },
          {
            test: /\.(scss|sass)$/,
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /(?<!\.module)\.(css|scss|sass)$/,
        exclude: [
          /node_modules/,
          /libs\/saba-games\/preview-template/
        ],
        rules: [
          {
            use: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            test: /\.(scss|sass)$/,
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(png|jp(e*)g|gif)$/,
        type: 'asset/inline'
      },
      {
        test: /\.(svg)$/,
        rules: [
          {
            include: resolve(__dirname, '../../libs'),
            rules: [
              {
                issuer: /\.(js|jsx|mjs|ts|tsx)$/,
                loader: '@svgr/webpack'
              },
              {
                issuer: /\.(css|scss|sass)$/,
                type: 'asset/inline'
              }
            ]
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'src/fonts/'
            }
          }
        ]
      },
      {
        test: /\.txt$/i,
        use: 'raw-loader'
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: [
          /(node_modules|bower_components|typings)/,
          /libs\/saba-games\/preview-template/
        ],
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
      }
    ]
  },
  optimization: {
    splitChunks: false,
    runtimeChunk: false,
    minimize: true,
    minimizer: [new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin()
    ]
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.APP_ENV': JSON.stringify(process.env.APP_ENV),
      'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
      'process.env.TAG_VERSION': JSON.stringify(version)
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new CopyPlugin({
      patterns: [
        {
          from: resolve(__dirname, 'package.json'),
          to: SEAL_COMPONENT_PROJECT
        },
        {
          from: resolve(__dirname, 'types'),
          to: resolve(SEAL_COMPONENT_PROJECT, 'types')
        },
        {
          from: resolve(VS_COMPONENT_WORKING_DIR, 'iframe'), // VirtualSport iframe
          to: SEAL_COMPONENT_OUTPUT,
      },
        {
          from: resolve(VSP_COMPONENT_WORKING_DIR, 'iframe'), // VirtualSportPush iframe
          to: SEAL_COMPONENT_OUTPUT,
        },
      ]
    }),
    new BundleAnalyzerPlugin({
      generateStatsFile: true,
      openAnalyzer: false,
      analyzerMode: 'static',
      statsFilename: '../bundle-stats.json',
      reportFilename: '../bundle-report.html'
    })
  ]
};
