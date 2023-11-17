module.exports = {
  env: {
    node: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
  },

  overrides: [
    {
      files: [".eslintrc.{js,cjs}"],
      env: {
        node: true,
      },
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
};
