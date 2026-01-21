'use client'

import { Toaster as ArkToaster } from '@ark-ui/react'
import { toaster } from '@/lib/toaster'

export const Toaster = () => (
  <ArkToaster toaster={toaster}>
    {(toast) => (
      <div>
        <h3>{toast.title}</h3>
        <p>{toast.description}</p>
      </div>
    )}
  </ArkToaster>
)
