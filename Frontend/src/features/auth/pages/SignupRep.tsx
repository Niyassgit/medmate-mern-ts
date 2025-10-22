import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { registerRep } from "../api";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  RegisterRepBody,
  registerMedicalRepSchema,
} from "../schemas/RegisterRepSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  getTerritories,
  getDepartments,
} from "@/features/shared/api/SharedApi";

const SignupRep = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);
  const [territories, setTerritories] = useState<
    { id: string; name: string }[]
  >([]);

  const form = useForm<RegisterRepBody>({
    resolver: zodResolver(registerMedicalRepSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      Cpassword: "",
      companyName: "",
      companyLogoUrl: null,
      employeeId: "",
      territories: [],
      departmentId: "",
    },
  });
  useEffect(() => {
    async function fetchDropdownData() {
      try {
        const deptData = await getDepartments();
        setDepartments(deptData.data.data);

        const terrData = await getTerritories();
        setTerritories(terrData.data.data);
      } catch (error) {
        toast.error("Failed to load departments or territories");
      }
    }
    fetchDropdownData();
  }, []);

  const onSubmit = async (data: RegisterRepBody) => {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, val]) => {
      if (key === "companyLogoUrl" && val instanceof File) {
        formData.append(key, val);
      } else if (Array.isArray(val)) {
        formData.append(key, JSON.stringify(val)); 
      } else if (val !== null && val !== undefined) {
        formData.append(key, String(val));
      }
    });

    const res = await registerRep(formData);

    if (res.data.success && res.data.email) {
      toast.success(res.data.message || "Registered successfully!");

      navigate("/verifyotp", {
        state: {
          email: res.data.email,
          purpose: "signup",
          expiredAt: res.data.expiredAt,
        },
      });
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Something went wrong");
  }
};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>

        {/* Phone + Company Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Password + Confirm Password */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <select
                  {...field}
                  value={field.value ?? ""}
                  className="
            w-full 
            border 
            rounded-lg 
            px-3 
            py-2 
            appearance-none 
            bg-gray-50 
            hover:bg-gray-100 
            focus:bg-gray-100 
            focus:ring-2 
            focus:ring-gray-400 
            focus:border-gray-500 
            transition-all 
            duration-150
          "
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="territories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <select
                  value={field.value?.[0] ?? ""} 
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? [value] : []); 
                  }}
                  className="
          w-full 
          border 
          rounded-lg 
          px-3 
          py-2 
          appearance-none 
          bg-gray-50 
          hover:bg-gray-100 
          focus:bg-gray-100 
          focus:ring-2 
          focus:ring-gray-400 
          focus:border-gray-500 
          transition-all 
          duration-150
        "
                >
                  <option value="">Select Territory</option>
                  {territories.map((terr) => (
                    <option key={terr.id} value={terr.id}>
                      {terr.name}
                    </option>
                  ))}
                </select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Employee ID + Department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter employee ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Company Logo */}
          <FormField
            control={form.control}
            name="companyLogoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Logo</FormLabel>
                <FormControl>
                  <div>
                    <input
                      id="companyLogo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        field.onChange(file);
                      }}
                    />

                    <label
                      htmlFor="companyLogo-upload"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 w-fit"
                    >
                      <img src="/ImgAdd.png" alt="upload" className="w-5 h-5" />
                      <span>Upload Logo</span>
                    </label>

                    {field.value && (
                      <p className="text-sm mt-1 text-gray-600">
                        Selected: {field.value.name}
                      </p>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#3fa8e9] hover:bg-[#349cd9]"
        >
          Register as Medical Rep
        </Button>
      </form>
    </Form>
  );
};

export default SignupRep;
