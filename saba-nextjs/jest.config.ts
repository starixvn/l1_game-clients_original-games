export default {
    collectCoverageFrom: ["**/*.{jsx,ts,tsx}"],
    moduleFileExtensions: ["ts", "tsx", "js"],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
    },
    testMatch: ["**/*.(test|spec).(ts|tsx)"],
    globals: {
        "ts-jest": {
            useBabelrc: true,
        },
    },
    coveragePathIgnorePatterns: ["node_modules", "enzyme.js", ".d.ts"],
    setupFilesAfterEnv: ["<rootDir>/enzyme.js", "jest-extended"],
    coverageReporters: ["json", "lcov", "text", "text-summary"],
    transformIgnorePatterns: ["/node_modules/", "^.+\\.module\\.(css|sass|scss)$"],
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/mocks.js",
        "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    },
    snapshotSerializers: ["enzyme-to-json/serializer"],
    testResultsProcessor: "jest-sonar-reporter",
};
