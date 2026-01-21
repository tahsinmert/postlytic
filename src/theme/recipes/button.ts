import { defineRecipe } from '@pandacss/dev'

export const button = defineRecipe({
  className: 'button',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'medium',
    borderRadius: 'l2',
    _focusVisible: { outline: '2px solid', outlineColor: 'border.outline' },
    _disabled: { opacity: 0.5, cursor: 'not-allowed' },
  },
  variants: {
    variant: {
      solid: { bg: 'accent.default', color: 'accent.fg' },
      outline: { borderWidth: '1px', borderColor: 'border.default' },
      ghost: { bg: 'transparent' },
    },
    size: {
      sm: { h: '8', px: '3', fontSize: 'sm' },
      md: { h: '10', px: '4', fontSize: 'md' },
      lg: { h: '12', px: '6', fontSize: 'lg' },
    },
  },
  defaultVariants: { variant: 'solid', size: 'md' },
})
