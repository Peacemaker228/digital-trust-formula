import { PropsWithChildren } from 'react'

import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'

import { ThemeProvider } from '@/components/providers/theme-providers'
import { Toaster } from '@/components/ui/toaster'

import './globals.css'

const montserrat = Montserrat({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: 'normal', // Или 'italic', если нужно
  subsets: ['latin'], // Это для поддержания международных символов, можно настроить
  variable: '--font-montserrat', // Название переменной для применения через CSS
})

export const metadata: Metadata = {
  title: 'Digital Trust Formula',
  description: 'Digital Trust Formula',
}

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body className={cn(montserrat.variable, 'antialiased')}>
        {/* <ThemeProvider> */}
        <Toaster />
        {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
