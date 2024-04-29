export default {
  bracketSpacing: true,
  importOrder: ['<THIRD_PARTY_MODULES>', '^@.+$', '^@.+/.*$', '^[./]'],
  importOrderSeparation: true,
  importOrderCaseInsensitive: true,
  importOrderSortSpecifiers: true,
  jsxSingleQuote: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  printWidth: 100,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
};
