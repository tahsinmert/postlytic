import { Accordion as ArkAccordion } from '@ark-ui/react'
import { styled } from '@/styled-system/jsx'
import { accordion } from '@/styled-system/recipes'
import { createStyleContext } from '@/lib/create-style-context'

const { withProvider, withContext } = createStyleContext(accordion)

const Accordion = withProvider(styled(ArkAccordion.Root), 'root')
const AccordionItem = withContext(styled(ArkAccordion.Item), 'item')
const AccordionContent = withContext(styled(ArkAccordion.ItemContent), 'content')
const AccordionItemIndicator = withContext(styled(ArkAccordion.ItemIndicator), 'itemIndicator')
const AccordionTrigger = withContext(styled(ArkAccordion.ItemTrigger), 'trigger')

export { Accordion, AccordionItem, AccordionContent, AccordionItemIndicator, AccordionTrigger }
