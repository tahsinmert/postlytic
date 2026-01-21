import { defineConfig } from '@pandacss/dev'
import parkConfig from './park-ui.json'
import { recipes, slotRecipes } from './src/theme/recipes'

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // The output directory for your css system
  outdir: 'src/styled-system',

  // Enable JSX style props and styled() factory for React
  jsxFramework: 'react',

  // Useful for theme customization
  theme: {
    extend: {
      ...parkConfig.theme,
      recipes,
      slotRecipes,
    },
  },
})
