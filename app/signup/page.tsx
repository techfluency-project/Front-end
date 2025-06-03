'use client'

import { Lock, Mail, User } from "lucide-react"
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from "react"
import Loading from "../components/loading"
import { signup } from "../lib/signup"
import { signin } from "../lib/signin"

const SignUp = () => {

  const router = useRouter()

  const [user, setUser] = useState("");
  const [mail, setMail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(false) 
  
  function validatePassword(password: string, confirmPassword: string): string[] {
    const errors: string[] = [];
  
    if (password.length < 8) {
      errors.push("A senha deve ter pelo menos 8 caracteres.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra maiúscula.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra minúscula.");
    }
    if (!/[!@#$%^&*(),.?\":{}|<>_\-\\/~`+=\[\];']/g.test(password)) {
      errors.push("A senha deve conter pelo menos um caractere especial.");
    }
    if (password !== confirmPassword) {
      errors.push("As senhas não coincidem.");
    }
  
    return errors;
  }
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'password' | 'confirm') => {
    const value = e.target.value;
  
    if (type === 'password') {
      setPass(value);
      setErrors(validatePassword(value, pass2));
    } else {
      setPass2(value);
      setErrors(validatePassword(pass, value));
    }
  };

  
  const processSignUp = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    const result = await signup(event, user, mail, pass, pass2, validatePassword);
    setIsLoading(false);
  
    if (result.success) {
      console.log("User signed up:", result.data);
      await signin(event, user, pass);
      router.push("/home");
    } else {
      console.error("Signup error:", result.error);
      errors.push(result.error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-10 h-screen w-screen">
        
        <div className="flex flex-col items-center gap-2">
          <img src="/logo.svg" className="size-16" alt="" />
          <h2 className="font-bold text-2xl">Techfluency</h2>
        </div>

        <div className="bg-blue-800 w-[480] p-10 rounded-md">
          <form onSubmit={processSignUp} className="flex flex-col gap-4">

            <div className="w-fit">
              {errors.map((error, index) => (
                <p key={index} className="text-red-600 text-sm wrap-normal">{error}</p>
              ))}
            </div>

            <label htmlFor="" className="space-y-1">
              <h3 className="text-white font-bold">Username</h3>
              <div className="flex items-center rounded-sm w-full bg-white p-2 gap-2">
                <input type="text" autoComplete="off"  className="focus:outline-none focus:border-transparent w-full" onChange={(e) => setUser(e.currentTarget.value)} />
                <User className="text-blue-800" />
              </div>
            </label>
            <label htmlFor="" className="space-y-1">
              <h3 className="text-white font-bold">Email</h3>
              <div className="flex items-center rounded-sm w-full bg-white p-2 gap-2">
                <input type="email" autoComplete="off" className="focus:outline-none focus:border-transparent w-full" onChange={(e) => setMail(e.currentTarget.value)} />
                <Mail className="text-blue-800" />
              </div>
            </label>
            <label htmlFor="" className="space-y-1">
              <h3 className="text-white font-bold">Password</h3>
              <div className="flex items-center rounded-sm w-full bg-white p-2 gap-2">
                <input type="password" className="focus:outline-none focus:border-transparent w-full" onChange={(e) => handleChange(e, 'password')} />
                <Lock className="text-blue-800" />
              </div>
            </label>
            <label htmlFor="" className="space-y-1">
              <h3 className="text-white font-bold">Repeat Password</h3>
              <div className="flex items-center rounded-sm w-full bg-white p-2 gap-2">
                <input type="password" className="focus:outline-none focus:border-transparent w-full" onChange={(e) => handleChange(e, 'confirm')} />
                <Lock className="text-blue-800" />
              </div>
            </label>

            <div className="flex flex-col items-center gap-2 mt-10">
              <input type="submit" className="bg-blue-950 p-2.5 text-lg w-full text-white rounded-sm font-bold cursor-pointer" value='Create account' />
              <p className="text-sm font-bold text-white cursor-pointer" onClick={() => router.push('/signin')}>Already have an account?</p>
            </div>
            
          </form>
        </div>

      </div>

      {isLoading && <Loading />}
    </>
  )

}

export default SignUp