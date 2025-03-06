const basePath = "";
const gameSettings = require("./game-settings.json");
const { v4: uuidv4 } = require("uuid");

const configType = process.env.CONFIG_TYPE || "DEFAULT";
let configs;

if (configType === "DEV_GN") {
    configs = require("./configs.gn.json");
} else {
    configs = require("./configs.json");
}

const appSettings = {
    ...configs,
    gameSettings,
};

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    publicRuntimeConfig: { appSettings },
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
            {
                source: "/saba-games",
                destination: "http://localhost:4200/saba-games",
            },
            {
                source: "/saba-games/:path*",
                destination: "http://localhost:4200/saba-games/:path*",
            },
            {
                source: "/nx-app",
                destination: "/nx-app/index.html",
            },
            {
                source: "/nx-app/:path*",
                destination: "/nx-app/:path*",
            },
            {
                source: "/nx-app/_next/:path*",
                destination: "/nx-app/_next/:path*",
            },
        ];
    },
    cleanDistDir: true,
    output: "standalone",
};

module.exports = nextConfig;
