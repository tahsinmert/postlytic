import { defineSlotRecipe } from '@pandacss/dev'

export const tabs = defineSlotRecipe({
  className: 'tabs',
  slots: ['root', 'list', 'trigger', 'content', 'indicator'],
  base: {
    root: { width: '100%' },
    list: {
      display: 'flex',
      position: 'relative',
      gap: '1',
      borderBottomWidth: '1px',
      borderColor: 'border.default',
    },
    trigger: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2 4',
      fontSize: 'sm',
      fontWeight: 'medium',
      color: 'fg.muted',
      background: 'transparent',
      borderBottomWidth: '2px',
      borderBottomColor: 'transparent',
      cursor: 'pointer',
      transition: 'all 0.2s',
      _hover: {
        color: 'fg.default',
      },
      _selected: {
        color: 'fg.default',
        borderBottomColor: 'color.palette.emerald.500',
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'border.outline',
        outlineOffset: '2px',
      },
      _disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
    content: {
      padding: '4',
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'border.outline',
      },
    },
    indicator: {
      position: 'absolute',
      bottom: '-1px',
      height: '2px',
      background: 'color.palette.emerald.500',
      transition: 'all 0.2s',
    },
  },
})
