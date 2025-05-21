'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { fredoka } from '../lib/fonts'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <header className='h-16 flex absolute left-0 justify-center w-full bg-gradient-to-r z-10 text-white from-blue-700 to-indigo-900'>
      <div className='w-[656px] flex justify-between items-center relative'>
        <h1 className={`${fredoka.className} font-extrabold text-3xl`}>Techfluency</h1>
        <button onClick={toggleMenu} aria-label="Toggle Menu">
          <Menu className='size-8' />
        </button>

        <div
          className={`
            absolute top-16 right-0 bg-white text-black rounded-md shadow-lg w-40 py-2 z-20 transform transition-all duration-300 ease-out
            ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
          `}
        >
          <a href="/" className="block px-4 py-2 hover:bg-gray-100">Home</a>
          <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">User Page</a>
          <a href="/flashcards" className="block px-4 py-2 hover:bg-gray-100">Flashcards</a>
        </div>
      </div>
    </header>
  )
}

export default Header
