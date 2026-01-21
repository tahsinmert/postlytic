import { defineSlotRecipe } from '@pandacss/dev'

export const accordion = defineSlotRecipe({
  className: 'accordion',
  slots: ['root', 'item', 'content', 'itemIndicator', 'trigger'],
  base: {
    root: { width: '100%' },
    item: { overflowAnchor: 'none' },
    trigger: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      gap: '3',
      fontWeight: 'medium',
      padding: '4 6',
      background: 'transparent',
      _focusVisible: { outline: '2px solid', outlineColor: 'border.outline' },
      _disabled: { opacity: 0.5, cursor: 'not-allowed' },
    },
    content: { overflow: 'hidden', paddingInline: '6' },
    itemIndicator: { transition: 'transform 0.2s', _open: { transform: 'rotate(180deg)' } },
  },
})
