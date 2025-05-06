import { Menu } from "lucide-react"
import { fredoka } from "../layout"

const Header = () => {

  return (
    <header className='h-16 flex absolute left-0 justify-center w-full bg-gradient-to-r z-10 text-white from-blue-700 to-indigo-900'>
      <div className='w-[656px] flex justify-between items-center'>
        <h1 className={`${fredoka.className} font-extrabold text-3xl`}>Techfluency</h1>
        <Menu className='size-8' />
      </div>
    </header> 
  )
}

export default Header