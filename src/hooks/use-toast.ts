'use client'

import { toaster } from '@/lib/toaster'

export type CreateToastOptions = {
  title?: string
  description?: string
  type?: 'success' | 'error' | 'loading' | 'info' | 'warning'
  duration?: number
  [key: string]: unknown
}

const useToast = () => ({
  toast: (options: CreateToastOptions) => toaster.create(options),
})

const toast = (options: CreateToastOptions) => toaster.create(options)

export { useToast, toast }
