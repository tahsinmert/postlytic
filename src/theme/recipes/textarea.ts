import { defineRecipe } from '@pandacss/dev'

export const textarea = defineRecipe({
  className: 'textarea',
  base: {
    display: 'flex',
    minH: '20',
    w: 'full',
    borderRadius: 'l2',
    borderWidth: '1px',
    borderColor: 'border.default',
    bg: 'bg.default',
    px: '3',
    py: '2',
    fontSize: 'sm',
    _placeholder: { color: 'fg.muted' },
    _focus: { outline: 'none', ringWidth: '2px', ringColor: 'border.outline' },
    _disabled: { opacity: 0.5, cursor: 'not-allowed' },
  },
})
