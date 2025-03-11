module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:react/jsx-runtime",
        "plugin:css-modules/recommended",
        "plugin:storybook/recommended",
        "prettier"
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: "latest",
        sourceType: "module"
    },
    plugins: ["react", "react-hooks", "import", "css-modules", "prettier"],
    rules: {
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "no-multiple-empty-lines": [
            "error",
            {
                max: 1
            }
        ],
        "no-multi-spaces": [
            "error",
            {
                ignoreEOLComments: false
            }
        ],
        "no-unused-vars": ["error"],
        "no-console": "error",
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "prettier/prettier": ["error"]
    },
    settings: {
        "import/resolver": {
            webpack: {
                config: {
                    resolve: {
                        extensions: ["", ".js", ".jsx"]
                    }
                }
            }
        },
        react: {
            // Regex for Component Factory to use,
            // default to "createReactClass"
            createClass: "createReactClass",
            // Pragma to use, default to "React"
            pragma: "React",
            // Fragment to use (may be a property of <pragma>), default to "Fragment"
            fragment: "Fragment",
            // React version. "detect" automatically picks the version you have installed.
            version: "detect",
            // Flow version
            // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
            // It will default to "latest" and warn if missing, and to "detect" in the future
            flowVersion: "latest"
        },
        propWrapperFunctions: [
            // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
            "forbidExtraProps",
            { property: "freeze", object: "Object" },
            { property: "myFavoriteWrapper" },
            // for rules that check exact prop wrappers
            { property: "forbidExtraProps", exact: true }
        ],
        componentWrapperFunctions: [
            // The name of any function used to wrap components, e.g. Mobx `observer` function. If this isn't set, components wrapped by these functions will be skipped.
            "observer", // `property`
            { property: "styled" }, // `object` is optional
            { property: "observer", object: "Mobx" },
            { property: "observer", object: "<pragma>" } // sets `object` to whatever value `settings.react.pragma` is set to
        ],
        formComponents: [
            // Components used as alternatives to <form> for forms, eg. <Form endpoint={ url } />
            "CustomForm",
            { name: "Form", formAttribute: "endpoint" }
        ],
        linkComponents: [
            // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
            "Hyperlink",
            { name: "Link", linkAttribute: "to" }
        ]
    }
};
