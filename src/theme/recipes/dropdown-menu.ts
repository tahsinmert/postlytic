import { defineSlotRecipe } from '@pandacss/dev'

export const dropdownMenu = defineSlotRecipe({
  className: 'dropdownMenu',
  slots: ['root', 'trigger', 'content', 'item', 'itemGroup', 'itemGroupLabel', 'separator', 'arrow', 'arrowTip', 'contextTrigger'],
  base: {
    root: {},
    content: { zIndex: 50, minW: '8rem', overflow: 'hidden', borderRadius: 'l2', borderWidth: '1px', borderColor: 'border.default', bg: 'bg.default', padding: '1', boxShadow: 'lg' },
    item: { position: 'relative', display: 'flex', cursor: 'default', alignItems: 'center', gap: '2', borderRadius: 'l1', px: '2', py: '1.5', fontSize: 'sm', outline: 'none', _focus: { bg: 'bg.subtle' }, _disabled: { opacity: 0.5, pointerEvents: 'none' } },
    trigger: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'l1', _focusVisible: { outline: '2px solid', outlineColor: 'border.outline' } },
    itemGroup: {},
    itemGroupLabel: { px: '2', py: '1.5', fontSize: 'xs', fontWeight: 'semibold', color: 'fg.muted' },
    separator: { my: '1', h: '1px', bg: 'border.default' },
    arrow: {},
    arrowTip: {},
    contextTrigger: {},
  },
})
