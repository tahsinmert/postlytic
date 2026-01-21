import { defineSlotRecipe } from '@pandacss/dev'

export const toast = defineSlotRecipe({
  className: 'toast',
  slots: ['root', 'title', 'description', 'closeTrigger'],
  base: {
    root: { display: 'flex', width: '100%', flexDirection: 'column', gap: '1', borderRadius: 'l2', borderWidth: '1px', borderColor: 'border.default', bg: 'bg.default', padding: '4', boxShadow: 'lg' },
    title: { fontWeight: 'medium', fontSize: 'sm' },
    description: { fontSize: 'sm', color: 'fg.muted' },
    closeTrigger: { position: 'absolute', top: '2', right: '2', borderRadius: 'l1', _focusVisible: { outline: '2px solid', outlineColor: 'border.outline' } },
  },
})
