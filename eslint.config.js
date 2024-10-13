// eslint-disable-next-line no-undef
// module.exports = {
//   env: {
//     browser: true,
//     es2021: true,
//   },
//   extends: ['google', 'eslint:recommended', 'plugin:prettier/recommended'],
//   parserOptions: {
//     ecmaVersion: 'latest',
//     sourceType: 'module',
//   },
//   rules: {
//     'require-jsdoc': 0,
//   },
// };
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
