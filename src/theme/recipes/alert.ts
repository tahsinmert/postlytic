import { defineSlotRecipe } from '@pandacss/dev'

export const alert = defineSlotRecipe({
  className: 'alert',
  slots: ['root', 'content', 'title', 'description', 'icon'],
  base: {
    root: { position: 'relative', width: '100%', borderRadius: 'l2', padding: '4', bg: 'bg.subtle' },
    content: {},
    title: { fontWeight: 'medium', mb: '1' },
    description: { fontSize: 'sm', color: 'fg.muted' },
    icon: { flexShrink: 0 },
  },
})
