import { defineSlotRecipe } from '@pandacss/dev'

export const card = defineSlotRecipe({
  className: 'card',
  slots: ['root', 'header', 'content', 'footer', 'title', 'description'],
  base: {
    root: { bg: 'bg.default', borderRadius: 'l2', borderWidth: '1px', borderColor: 'border.default', overflow: 'hidden' },
    header: { padding: '6', display: 'flex', flexDirection: 'column', gap: '1.5' },
    content: { padding: '6', paddingTop: 0 },
    footer: { padding: '6', paddingTop: 0, display: 'flex', alignItems: 'center', gap: '3' },
    title: { fontSize: 'lg', fontWeight: 'semibold', letterSpacing: '-0.025em', lineHeight: 'tight' },
    description: { fontSize: 'sm', color: 'fg.muted' },
  },
})
