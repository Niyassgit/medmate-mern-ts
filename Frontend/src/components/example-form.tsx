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

type LoginFormValues = {
  email: string
  password: string
}

interface ExampleFormProps {
  onSubmit: (values: LoginFormValues) => void
  onGoogleLogin?: () => void   // optional prop for Google login
}

export default function ExampleForm({ onSubmit, onGoogleLogin }: ExampleFormProps) {
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  return (
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
                    <Input type="password" placeholder="********" {...field} />
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
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center space-x-2"
          onClick={onGoogleLogin}
        >
          <img
            src="https://png.pngtree.com/png-clipart/20230916/original/pngtree-google-logo-vector-png-image_12256710.png"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Continue with Google</span>
        </Button>
      </CardContent>
    </Card>
  )
}
