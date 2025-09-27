"use client"

import { useForm } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import GoogleAuthButton from "@/features/auth/components/GoogleAuthButton"
import { validateLogin,LoginRequestBody } from "@/features/auth/schemas/LoginSchema"
import {zodResolver} from "@hookform/resolvers/zod"
import { Eye,EyeOff } from "lucide-react"
import { useState } from "react"


interface ExampleFormProps {
  onSubmit: (values: LoginRequestBody) => void
  onGoogleLogin?: () => void  
}

export default function ExampleForm({ onSubmit}: ExampleFormProps) {
  const [showPassword,setShowPassword]=useState(false);

  const form = useForm<LoginRequestBody>({
    resolver:zodResolver(validateLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  return (
    <>

    <Card className="w-[400px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                    <Input type={showPassword?"text": "password"} placeholder="********" {...field} />
                    <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={()=>setShowPassword((prev)=>!prev)}
                    >{showPassword ? <EyeOff className="w-4 h-4"/>: <Eye className="w-4 h-4"/>}</button>
                    </div>

                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#3fa8e9] hover:bg-[#349cd9] text-white"
            >
              Login
            </Button>
          </form>
        </Form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Auth Button */}
       <div className="flex justify-center">
        <GoogleAuthButton />
        </div>
      </CardContent>
    </Card>
    </>
  )
}
