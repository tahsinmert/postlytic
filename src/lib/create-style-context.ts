import React, { createContext, useContext, forwardRef, type ElementType } from 'react'
import { styled, type HTMLStyledProps } from '@/styled-system/jsx'

export function createStyleContext<Styles extends Record<string, any>>(
  styles: Styles,
) {
  const StyleContext = createContext<Styles | null>(null)

  function withProvider<P extends object>(
    Component: ElementType<P>,
    part: keyof Styles,
  ) {
    const StyledComponent = styled(Component)
    const WithProvider = forwardRef<any, HTMLStyledProps<typeof StyledComponent>>((props, ref) => {
      const providerProps = { value: styles }
      const styledComponentProps = Object.assign({ ref: ref, className: styles?.[part] }, props)

      return React.createElement(
        StyleContext.Provider,
        providerProps,
        React.createElement(StyledComponent, styledComponentProps),
      )
    })
    WithProvider.displayName = (Component as any).displayName || 'WithProvider'
    return WithProvider
  }

  function withContext<P extends object>(
    Component: ElementType<P>,
    part: keyof Styles,
  ) {
    const StyledComponent = styled(Component)

    const WithContext = forwardRef<any, HTMLStyledProps<typeof StyledComponent>>((props, ref) => {
      const styles = useContext(StyleContext)
      const styledComponentProps = Object.assign({ ref: ref, className: styles?.[part] }, props)
      return React.createElement(StyledComponent, styledComponentProps)
    })
    WithContext.displayName = (Component as any).displayName || 'WithContext'
    return WithContext
  }

  return {
    withProvider,
    withContext,
  }
}
