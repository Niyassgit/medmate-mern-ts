import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  password: z.string().min(1, "Password is required"),
});

interface VerifyPasswordProps {
  onVerify: (password: string) => Promise<any>;
  onSuccessRedirect: string;
  title?: string;
  subTitle?: string;
}

export default function VerifyPassword({
  onVerify,
  onSuccessRedirect,
  title = "Verify Password",
  subTitle = "Please enter your current password to continue",
}: VerifyPasswordProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "" },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      setIsLoading(true);
      await onVerify(values.password);
      toast.success("Password verified successfully");
      navigate(onSuccessRedirect);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md border p-6">
        {/* ✅ Cartoon Image on Top */}
        <div className="flex justify-center mb-4">
          <img
            src="https://static.thenounproject.com/png/verification-password-icon-7830723-512.png"
            alt="Verify password"
            className="h-28 object-contain"
          />
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">{subTitle}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="h-11 text-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Buttons Row – Fixed Alignment */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11 text-black hover:text-black"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="flex-1 h-11"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
