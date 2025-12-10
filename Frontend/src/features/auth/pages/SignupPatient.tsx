import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerGuest } from "../api";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  RegisterGuestSchema,
  RegisterGuestBody,
} from "../schemas/RegisterPatientSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { getTerritories } from "@/features/shared/api/SharedApi";

interface Territory {
  id: string;
  name: string;
  region: string;
}

const SignupPatient = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [loadingTerritories, setLoadingTerritories] = useState(false);

  const form = useForm<RegisterGuestBody>({
    resolver: zodResolver(RegisterGuestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      Cpassword: "",
      territoryId: "",
    },
  });

  useEffect(() => {
    const fetchTerritories = async () => {
      try {
        setLoadingTerritories(true);
        const response = await getTerritories();
        if (response.data?.data) {
          setTerritories(response.data.data);
        } else if (Array.isArray(response.data)) {
          setTerritories(response.data);
        }
      } catch (error) {
        console.error("Failed to load territories:", error);
        toast.error("Failed to load territories");
      } finally {
        setLoadingTerritories(false);
      }
    };
    fetchTerritories();
  }, []);

  const onSubmit = async (values: RegisterGuestBody) => {
    try {
      // Ensure all required fields are present and not empty
      if (!values.name || !values.email || !values.phone || !values.password) {
        toast.error("Please fill in all required fields");
        return;
      }

      const payload = {
        name: String(values.name).trim(),
        email: String(values.email).trim(),
        phone: String(values.phone).trim(),
        password: String(values.password),
        territoryId: values.territoryId || undefined,
      };

      // Debug: Log the payload to see what's being sent
      console.log("Guest registration payload:", payload);

      const res = await registerGuest(payload);

      if (res.data.success && res.data.email && res.data.expiredAt) {
        toast.success(res.data.message || "Registration successful!");
        navigate("/verifyotp", {
          state: {
            email: res.data.email,
            purpose: "signup",
            expiredAt: res.data.expiredAt,
          },
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      toast.error(errorMessage);
      console.error("Registration error:", error.response?.data || error);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex justify-center items-center bg-gradient-to-b from-[#185891]">
      <div className="absolute inset-0"></div>

      <div className="relative z-10 flex w-full max-w-5xl min-h-[500px] md:min-h-[600px] rounded-2xl shadow-2xl overflow-hidden bg-white">
        {/* Left image + logo */}
        <div className="hidden md:flex w-1/2 relative">
          <img
            src="/med-rep-mar-8-2.png"
            alt="Register"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0">
            <img src="/logo.png" alt="MedMate Logo" className="h-20 w-auto" />
          </div>
        </div>

        {/* Right form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 text-center md:text-left">
            Create Guest Account
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center md:text-left">
            Join MedMate to manage your prescriptions and health records
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Territory */}
              <FormField
                control={form.control}
                name="territoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Territory (Optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loadingTerritories}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your territory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {territories.map((territory) => (
                          <SelectItem key={territory.id} value={territory.id}>
                            {territory.name} - {territory.region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

              {/* Confirm Password */}
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
                className="w-full bg-[#3fa8e9] hover:bg-[#349cd9]"
              >
                Create Account
              </Button>
            </form>
          </Form>

          <div className="flex flex-col items-center mt-4 space-y-2">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/auth/login/guest"
                className="text-[#3fa8e9] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPatient;

