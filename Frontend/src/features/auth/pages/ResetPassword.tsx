import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ResetPasswordBody,
  ResetPasswordSchema,
} from "../schemas/ResetPasswordSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../api";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const location = useLocation();
  const { email, otp } = location.state || {};
  const form = useForm<ResetPasswordBody>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      Cpassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordBody) => {
    if (!email || !otp) {
      toast.error("Missing email or OTP. Please restart the reset flow.");
      return;
    }

    try {
      const res = await resetPassword(email, otp, values.password);

      toast.success(res.data.message || "password reset successfully");
      setTimeout(() => navigate("/auth/login", { replace: true }), 1200);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to reset password.Please try again"
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="flex flex-col justify-center items-center space-y-2">
          <img src="/reset-pass.png" alt="pass-reset-image" />
          <CardTitle>Change Your Password</CardTitle>
          <span>Enter a new password below to change your password</span>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Cpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showCPassword ? "text" : "password"}
                          placeholder="Repeat your password"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showCPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full  bg-[#3fa8e9] hover:bg-[#1f6696]"
              >
                Reset Now
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-sm text-center">
            <Link to={"/auth/login"} className="text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
