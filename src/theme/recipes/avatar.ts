import { defineSlotRecipe } from '@pandacss/dev'

export const avatar = defineSlotRecipe({
  className: 'avatar',
  slots: ['root', 'image', 'fallback'],
  base: {
    root: { position: 'relative', display: 'flex', flexShrink: 0, overflow: 'hidden', borderRadius: 'full' },
    image: { aspectRatio: '1', width: '100%', height: '100%', objectFit: 'cover' },
    fallback: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', bg: 'bg.muted', fontSize: 'sm', fontWeight: 'medium' },
  },
})
