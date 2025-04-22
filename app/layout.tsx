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
    <html lang="en" className={`flex justify-center h-full ${dmSans.className}`}>
      <body>
        <header className='h-10 flex justify-center w-screen bg-gradient-to-r text-white from-blue-700 to-indigo-900'>
          <div className='w-[656px] flex justify-between items-center'>
            <h1 className={`${fredoka.className} font-extrabold text-2xl`}>Techfluency</h1>
            <Menu />
          </div>
        </header> 
        {children}
      </body>
    </html>
  )
}