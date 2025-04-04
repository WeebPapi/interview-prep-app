"use client"
import React, { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import CustomFormField from "./FormField"
import { useRouter } from "next/navigation"
import { signIn, signUp } from "@/lib/actions/auth.action"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"
import { auth } from "@/firebase/client"
import { Loader } from "rsuite"

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  })
}

interface AuthFormProps {
  type: FormType
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const formSchema = authFormSchema(type)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const signInWithLoading = async ({ email, idToken }: SignInParams) => {
    setIsLoading(true)
    await signIn({ email, idToken })
    setIsLoading(false)
  }
  const signUpWithLoading = async ({
    email,
    uid,
    name,
    password,
  }: SignUpParams) => {
    setIsLoading(true)
    const result = await signUp({ email, uid, name, password })
    setIsLoading(false)
    return result
  }

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )
        const result = await signUpWithLoading({
          uid: userCredentials.user.uid,
          name: name as string,
          email,
          password,
        })
        if (!result?.success) {
          toast.error(result?.message)
          return
        }
        toast.success("Account created successfully. Please sign in.")
        router.push("/sign-in")
      } else if (type === "sign-in") {
        const { email, password } = values
        const userCredentials = signInWithEmailAndPassword(
          auth,
          email,
          password
        )
        const idToken = await (await userCredentials).user.getIdToken()

        if (!idToken) {
          toast.error("Sign in failed")
          return
        }

        signInWithLoading({ email, idToken })
        toast.success("Signed in successfully")
        router.push("/")
      }
    } catch (error) {
      console.error(error)
      toast.error("There was an issue")
    }
  }

  const isSignIn = type === "sign-in"

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col items-center gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src={"/logo.svg"} alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>
        <h3>Practice Job Interviews With AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4 w-full form"
          >
            {!isSignIn && (
              <CustomFormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
              />
            )}
            <CustomFormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your Email"
            />
            <CustomFormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Your Password"
              type="password"
            />
            {isLoading && <Loader />}
            <Button type="submit" className="btn">
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center cursor-pointer">
          <Link href={!isSignIn ? "/sign-in" : "/sign-up"}>
            {isSignIn ? "No account yet?" : "Have an account already?"}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm
