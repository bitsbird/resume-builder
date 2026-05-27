export default {
  // Core styling configurations
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',

  // 1. Structural formatting plugins
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss', // MUST BE AT THE END OF THE ARRAY
  ],

  // 2. Strict Alphabetical Grouping Layers
  importOrder: [
    '^react$', // 1. React components always at the absolute top
    '^next/(.*)$', // 2. Next.js frameworks second
    '<THIRD_PARTY_MODULES>', // 3. Any npm web packages
    '^@/(.*)$', // 4. Project-aliased paths (e.g., @/components, @/hooks)
    '^[./]', // 5. Local relative imports and stylesheets
  ],
  importOrderSeparation: true, // Adds visual empty space between import blocks
  importOrderSortSpecifiers: true, // Alphabetizes details inside destructured curly braces
};
