const basePath = "";
const gameSettings = require("./game-settings.json");
const configsBySystem = require("./configs.json");
const { v4: uuidv4 } = require("uuid");
const isSC = false;
const configs = isSC ? configsBySystem.SC : configsBySystem.GN;
const appSettings = {
    ...configs,
    gameSettings,
};

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    isSC,
    publicRuntimeConfig: { appSettings, isSC },
    productionBrowserSourceMaps: configs.enableSourceMap,
    generateBuildId: async () => {
        return uuidv4();
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    webpack: (config, options) => {
        if (!options.isServer) {
            config.resolve.alias["@sentry/node"] = "@sentry/browser";
        }
        config.plugins.push(
            new options.webpack.DefinePlugin({
                "process.env.NEXT_IS_SERVER": JSON.stringify(options.isServer.toString()),
            })
        );

        config.module.rules.push({
            test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|mp3)$/,
            use: {
                loader: "url-loader",
                options: {
                    limit: 100000,
                },
            },
        });

        return config;
    },
    basePath,
    env: {
        buildVersion: uuidv4(),
    },
    async rewrites() {
        return [
            {
                source: "/health",
                destination: "/api/health",
            },
        ];
    },
    cleanDistDir: true,
    output: "standalone",
};

module.exports = nextConfig;
