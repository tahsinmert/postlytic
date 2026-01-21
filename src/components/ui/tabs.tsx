import { Tabs as ArkTabs } from '@ark-ui/react'
import { styled } from '@/styled-system/jsx'
import { tabs } from '@/styled-system/recipes'
import { createStyleContext } from '@/lib/create-style-context'

const { withProvider, withContext } = createStyleContext(tabs)

const TabsRoot = withProvider(styled(ArkTabs.Root), 'root')
const TabsList = withContext(styled(ArkTabs.List), 'list')
const TabsTrigger = withContext(styled(ArkTabs.Trigger), 'trigger')
const TabsContent = withContext(styled(ArkTabs.Content), 'content')
const TabsIndicator = withContext(styled(ArkTabs.Indicator), 'indicator')

export {
  TabsRoot as Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator,
}
