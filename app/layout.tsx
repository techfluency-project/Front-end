import { Menu } from 'lucide-react';
import './globals.css';
import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { Fredoka } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Techfluency',
  description: 'English made easy',
  icons: {
    icon: '/logo.svg',
  },
}

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
})
const fredoka = Fredoka({
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
        <header className='h-16 flex absolute left-0 justify-center w-full bg-gradient-to-r z-10 text-white from-blue-700 to-indigo-900'>
          <div className='w-[656px] flex justify-between items-center'>
            <h1 className={`${fredoka.className} font-extrabold text-3xl`}>Techfluency</h1>
            <Menu className='size-8' />
          </div>
        </header> 
        {children}
      </body>
    </html>
  )
}