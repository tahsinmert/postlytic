import { Toast as ArkToast } from '@ark-ui/react'
import { styled } from '@/styled-system/jsx'
import { toast } from '@/styled-system/recipes'
import { createStyleContext } from '@/lib/create-style-context'

const { withProvider, withContext } = createStyleContext(toast)

const Toast = withProvider(styled(ArkToast.Root), 'root')
const CloseTrigger = withContext(styled(ArkToast.CloseTrigger), 'closeTrigger')
const Description = withContext(styled(ArkToast.Description), 'description')
const Title = withContext(styled(ArkToast.Title), 'title')

export { CloseTrigger, Description, Title, Toast }
