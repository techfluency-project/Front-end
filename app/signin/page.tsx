'use client'

import { Lock, User } from "lucide-react"
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from "react"
import Loading from "../components/loading"
import { signin } from "../lib/signin"

const SignIn = () => {

  const router = useRouter()

  const [ user, setUser ] = useState<string>("")
  const [ pass, setPass ] = useState<string>("")
  const [ isLoading, setIsLoading ] = useState<boolean>(false)

  const processSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (!user || !pass) {
      return;
    }
  
    setIsLoading(true);
  
    const result = await signin(event, user, pass);
  
    setIsLoading(false);
  
    if (result.success) {
      console.log("Signed in:", result.data);
      router.push("/home");
    } else {
      console.error("Sign-in error:", result.error);
      alert("Sign-in failed: " + result.error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-10 h-screen w-screen">
        
        <div className="flex flex-col items-center gap-2">
          <img src="/logo.svg" className="size-16" alt="" />
          <h2 className="font-bold text-2xl">Techfluency</h2>
        </div>

        <div className="bg-blue-800 p-10 rounded-md">
          <form onSubmit={processSignIn} className="flex flex-col gap-4">

            <label htmlFor="" className="space-y-1">
              <h3 className="text-white font-bold">Username</h3>
              <div className="flex items-center rounded-sm w-80 bg-white p-2 gap-2">
                <input type="text" className="focus:outline-none focus:border-transparent w-full" onChange={(e) => setUser(e.currentTarget.value)} />
                <User className="text-blue-800" />
              </div>
            </label>
            <label htmlFor="" className="space-y-1">
              <h3 className="text-white font-bold">Password</h3>
              <div className="flex items-center rounded-sm w-80 bg-white p-2 gap-2">
                <input type="password" className="focus:outline-none focus:border-transparent w-full" onChange={(e) => setPass(e.currentTarget.value)} />
                <Lock className="text-blue-800" />
              </div>
            </label>

            <div className="flex flex-col items-center gap-2 mt-10">
              <input type="submit" className="bg-blue-950 p-2.5 text-lg w-full text-white rounded-sm font-bold cursor-pointer" value='Login' />
              <p className="text-sm font-bold text-white cursor-pointer" onClick={() => router.push('/signup')}>Create an account?</p>
            </div>
            
          </form>
        </div>

      </div>

      {isLoading && <Loading />}
    </>
  )

}

export default SignIn