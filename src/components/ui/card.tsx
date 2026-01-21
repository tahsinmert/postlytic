import { ark } from '@ark-ui/react'
import { styled } from '@/styled-system/jsx'
import { card } from '@/styled-system/recipes'
import { createStyleContext } from '@/lib/create-style-context'

const { withProvider, withContext } = createStyleContext(card)

const Root = withProvider(styled(ark.div), 'root')
const Content = withContext(styled(ark.div), 'content')
const Description = withContext(styled(ark.div), 'description')
const Footer = withContext(styled(ark.div), 'footer')
const Header = withContext(styled(ark.div), 'header')
const Title = withContext(styled(ark.div), 'title')

export {
  Content,
  Description,
  Footer,
  Header,
  Root,
  Title,
  // Aliases for shadcn/Radix-style usage
  Root as Card,
  Content as CardContent,
  Description as CardDescription,
  Header as CardHeader,
  Title as CardTitle,
}
