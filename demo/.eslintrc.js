module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ["packj"],
  extends: ["eslint:recommended"],
  rules: {
    "packj/audit": "warn",
  },
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
};
