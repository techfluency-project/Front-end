import './globals.css';
import type { Metadata } from 'next'
import { DM_Sans, Fredoka } from 'next/font/google'

const metadata: Metadata = {
  title: 'Techfluency',
  description: 'English made easy',
  icons: {
    icon: '/logo.svg',
  },
}

export const fredoka = Fredoka({
  subsets: ['latin'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode 
}) {
  return (
    <html lang="en" className={`flex justify-center h-screen ${dmSans.className}`}>
      <body>
        {children}
      </body>
    </html>
  )
}