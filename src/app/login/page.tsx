'use client'

import { type SubmitEvent } from "react"
import { validateSignup, validateLogin } from "@/features/auth/auth"
import { createClient } from "@/lib/supabse/client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

import { useRouter } from "next/navigation"

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {useState } from "react"

const LoginPage = () => {

    const [isSignUp, setIsSignup] = useState(true)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [conPassword, setConPassword] = useState("");
    const router = useRouter()

    const supabse = createClient()

    const showToast = (title:string, msg:string)=>{
        
        const id = toast.add({
            title:title,
            description:msg,
            actionProps:{
                children:"Undo",
                onClick(){
                    toast.close(id)
                }
            }
        })
    }

    const handleSubmit = async (e:SubmitEvent<HTMLFormElement>) =>{
        e.preventDefault();
        
        if(isSignUp){
            let date = {
                name,
                email,
                password,
                confirmPassword: conPassword
            }

            let validateError = validateSignup(date)

            if(validateError){
                console.log(validateError);
                return;
            }

            const {data, error} = await supabse.auth.signUp({
                email,
                password,
                options:{data:{full_name: name}}
            })

            if(error){
                console.log(error);
                return;
            }

            
            
            showToast("Please check your email", "Check your email and follow the process.")
            return;
        }

        // login

        let date = {
                email,
                password,
            }

        let validationError = validateLogin(date)

        if(validationError){
            console.log(validationError);
            return;
        }

        const {data, error} = await supabse.auth.signInWithPassword({email, password})

        if(error){
            console.log(error.message)
            showToast("Something went wrong", error.message)
            return;
        }
        
        router.push('/dashboard')

        return;
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

        {/* Brand */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-[#4650C9]">
            Care Tracker
          </h1>
        </div>

        {/* Heading */}
        <div className="mb-4 space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {isSignUp?"Create your account":"Welcome back"}
          </h2>
          <p className="text-sm leading-6 text-slate-500">
            {isSignUp?"Join your organization to track audits and findings.":"Sign in to review audits and track findings."}
                
          </p>
        </div>

        {/* Form */}
        <form method="post" onSubmit={handleSubmit}>
          <FieldGroup className="gap-5">
            <Field className={isSignUp?"inline-block":"hidden"}>
              <FieldLabel htmlFor="name">
                Full name
              </FieldLabel>
              <Input
                onChange={(e) => setName(e.target.value)}
                id="name"
                required = {isSignUp}
                value={name}
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Jordan Lee"
                className="h-9 rounded-md border-slate-300 focus-visible:ring-1 focus-visible:ring-[#5865E8]/40 focus-visible:ring-offset-0"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">
                Work email
              </FieldLabel>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@organization.com"
                className="h-9 rounded-md border-slate-300 focus-visible:ring-1 focus-visible:ring-[#5865E8]/40 focus-visible:ring-offset-0"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">
                Password
              </FieldLabel>
              <Input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="h-9 rounded-md border-slate-300 focus-visible:ring-1 focus-visible:ring-[#5865E8]/40 focus-visible:ring-offset-0"
              />
            </Field>

            <Field className={`${isSignUp?"inline-block":"hidden"}`}>
              <FieldLabel htmlFor="confirmPassword">
                Confirm password
              </FieldLabel>
              <Input
               onChange={(e) => setConPassword(e.target.value)}
                value={conPassword}
                required = {isSignUp}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                className="h-9 rounded-md border-slate-300 focus-visible:ring-1 focus-visible:ring-[#5865E8]/40 focus-visible:ring-offset-0"
              />
            </Field>

            <Field className="gap-4">
              <Button
                type="submit"
                className="h-11 w-full rounded-lg bg-[#5865E8] font-medium text-white transition-colors hover:bg-[#4650C9]"
              >
                {isSignUp?"Create account":"Sign in"}
              </Button>

              <p className="text-center text-sm text-slate-500">
                {isSignUp?"Already have an account?":"New here? "}{" "}
                <button
                  onClick={()=>setIsSignup(!isSignUp)}  
                  type="button"
                  className="font-semibold text-[#5865E8] underline-offset-4 hover:text-[#4650C9] hover:underline"
                >
                  {`${isSignUp?"Sign in":"Create your account"}`}
                </button>
              </p>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
