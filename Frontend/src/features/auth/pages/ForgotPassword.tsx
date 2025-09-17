import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link} from "react-router-dom";
import {
  ForgotPasswordSchema,
  ForgotPasswordBody,
} from "../schemas/ForgotPasswordSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Mail} from "lucide-react"
import { forgotPassword } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const ForgotPassword = () => {
  const navigate=useNavigate();

  const form = useForm<ForgotPasswordBody>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const handleSubmit = async (values: ForgotPasswordBody) => {
    const res= await forgotPassword(values.email);
   
    try {
      if(res.data.success){
      toast.success(res.data.message);
         navigate("/forgotpassword/verifyotp",{state:{email:res.data.email,purpose:"reset"}});
    }
    } catch (error:any) {
          toast.error(error.response?.data?.message || "Something went wrong");
    }
    
  };
  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-[400px] shadow-lg">
       <CardHeader className="flex flex-col items-center text-center space-y-2">
          <img
            src="/change-password-vector-iconlock-reload.webp"
            alt="forgot-password-img"
            className="w-70 h-auto"
          />
          <CardTitle className="text-3xl font-bold">
            Forgot your password?
          </CardTitle>
          <span>
            Please enter the email address you'd like your password reset
            information sent to
          </span>
        </CardHeader>
        <CardContent >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <div className="relative">
                        <Mail  className="absolute  left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <Input placeholder="Enter your email" className="pl-10" {...field} />
                        </div>
                     
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <Button type="submit" className="mt-4 w-full bg-[#3fa8e9] hover:bg-[#1f6696]">
                Reset Password
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
    </>
  );
};

export default ForgotPassword;
