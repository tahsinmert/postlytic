import { defineRecipe } from '@pandacss/dev'

export const formLabel = defineRecipe({
  className: 'formLabel',
  base: {
    fontSize: 'sm',
    fontWeight: 'medium',
    color: 'fg.default',
    _disabled: { opacity: 0.5, cursor: 'not-allowed' },
  },
})
