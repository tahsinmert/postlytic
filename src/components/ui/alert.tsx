import { ark } from '@ark-ui/react'
import { forwardRef, type ComponentProps } from 'react'
import { styled } from '@/styled-system/jsx'
import { alert } from '@/styled-system/recipes'
import { createStyleContext } from '@/lib/create-style-context'

const { withProvider, withContext } = createStyleContext(alert)

const RootWithProvider = withProvider(styled(ark.div), 'root')

const Alert = forwardRef<HTMLDivElement, ComponentProps<typeof RootWithProvider>>(
  function Alert(props, ref) {
    return <RootWithProvider ref={ref} {...props} role="alert" />
  }
)

const AlertContent = withContext(styled(ark.div), 'content')
const AlertDescription = withContext(styled(ark.div), 'description')
const AlertIcon = withContext(styled(ark.div), 'icon')
const AlertTitle = withContext(styled(ark.div), 'title')

export { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle }
