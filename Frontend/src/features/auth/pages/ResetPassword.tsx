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
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const form = useForm<ResetPasswordBody>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      Cpassword: "",
    },
  });

  const onSubmit = () => {

    
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="flex flex-col justify-center items-center space-y-2">
          <img src="/reset-pass.png" alt="pass-reset-image" />
          <CardTitle>Change Your Password</CardTitle>
          <span >Enter a new password below to change your password</span>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="Cpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confrim password</FormLabel>
                   <FormControl>
                        <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
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
