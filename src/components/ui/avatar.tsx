import { Avatar as ArkAvatar } from '@ark-ui/react'
import { styled } from '@/styled-system/jsx'
import { avatar } from '@/styled-system/recipes'
import { createStyleContext } from '@/lib/create-style-context'

const { withProvider, withContext } = createStyleContext(avatar)

const Root = withProvider(styled(ArkAvatar.Root), 'root')
const Fallback = withContext(styled(ArkAvatar.Fallback), 'fallback')
const Image = withContext(styled(ArkAvatar.Image), 'image')

export const Avatar = Root
export const AvatarFallback = Fallback
export const AvatarImage = Image

export { Fallback, Image, Root }
