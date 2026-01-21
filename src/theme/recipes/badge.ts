import { defineRecipe } from '@pandacss/dev'

export const badge = defineRecipe({
  className: 'badge',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'l1',
    fontWeight: 'medium',
    whiteSpace: 'nowrap',
    fontSize: 'xs',
  },
  variants: {
    variant: {
      solid: { bg: 'accent.default', color: 'accent.fg' },
      outline: { borderWidth: '1px', borderColor: 'border.default' },
      subtle: { bg: 'accent.subtle', color: 'fg.default' },
    },
  },
  defaultVariants: { variant: 'solid' },
})
