import { Menu as ArkMenu } from '@ark-ui/react'
import { styled } from '@/styled-system/jsx'
import { dropdownMenu } from '@/styled-system/recipes'
import { createStyleContext } from '@/lib/create-style-context'

const { withProvider, withContext } = createStyleContext(dropdownMenu)

const Root = withProvider(ArkMenu.Root, 'root')
const Arrow = withContext(styled(ArkMenu.Arrow), 'arrow')
const ArrowTip = withContext(styled(ArkMenu.ArrowTip), 'arrowTip')
const Content = withContext(styled(ArkMenu.Content), 'content')
const ContextTrigger = withContext(styled(ArkMenu.ContextTrigger), 'contextTrigger')
const ItemGroup = withContext(styled(ArkMenu.ItemGroup), 'itemGroup')
const ItemGroupLabel = withContext(styled(ArkMenu.ItemGroupLabel), 'itemGroupLabel')
const Item = withContext(styled(ArkMenu.Item), 'item')
const Separator = withContext(styled(ArkMenu.Separator), 'separator')
const Trigger = withContext(styled(ArkMenu.Trigger), 'trigger')

export {
  Arrow,
  ArrowTip,
  Content,
  ContextTrigger,
  Item,
  ItemGroup,
  ItemGroupLabel,
  Root,
  Separator,
  Trigger,
}
