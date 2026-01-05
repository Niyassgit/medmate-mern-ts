import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { registerDoctor } from "../api";
import { useNavigate } from "react-router-dom";
import {
  RegisterDoctorSchema,
  RegisterDoctorBody,
} from "../schemas/RegisterDoctorSchema";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getDepartments,
  getTerritories,
} from "@/features/shared/api/SharedApi";

const SignupDoctor = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);
  const [territories, setTerritories] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    async function fetchDropdownData() {
      try {
        const deptData = await getDepartments();
        setDepartments(deptData.data.data);

        const terrData = await getTerritories();
        setTerritories(terrData.data.data);
      } catch{
        toast.error("Failed to load departments or territories");
      }
    }
    fetchDropdownData();
  }, []);

  const form = useForm<RegisterDoctorBody>({
    resolver: zodResolver(RegisterDoctorSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      Cpassword: "",
      departmentId: "",
      territoryId: "",
      hospital: "",
      registrationId: "",
      licenseImageUrl: null,
      opStartTime: "",
      opEndTime: "",
      hasOwnClinic: false,
    },
  });

  const onSubmit = async (values: RegisterDoctorBody) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (key === "licenseImageUrl" && val instanceof File) {
          formData.append(key, val);
        } else if (val !== null && val !== undefined) {
          formData.append(key, String(val));
        }
      });

      const res = await registerDoctor(formData);

      if (res.data.success && res.data.email && res.data.expiredAt) {
        toast.success(res.data.message);
        navigate("/verifyotp", {
          state: {
            email: res.data.email,
            purpose: "signup",
            expiredAt: res.data.expiredAt,
          },
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
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
            name="territoryId"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FormField
            control={form.control}
            name="registrationId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Registration number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="licenseImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div>
                    <input
                      id="liscense-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        field.onChange(file);
                      }}
                    />

                    <label
                      htmlFor="liscense-upload"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 w-fit"
                    >
                      <img src="/ImgAdd.png" alt="upload" className="w-5 h-5" />
                      <span>License</span>
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
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-2 gap-4">
            {/* OP Start Time */}
            <FormField
              control={form.control}
              name="opStartTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-600">
                    OP Start Time
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      step="60"
                      onChange={(e) => field.onChange(e.target.value || "")}
                      className="!border-gray-300 !rounded-xl !px-3 !py-2 !text-gray-700 !focus:ring-2 !focus:ring-blue-500 !focus:border-blue-500 !shadow-sm cursor-pointer"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 mt-1" />
                </FormItem>
              )}
            />

            {/* OP End Time */}
            <FormField
              control={form.control}
              name="opEndTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-600">
                    OP End Time
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      step="60"
                      onChange={(e) => field.onChange(e.target.value || "")}
                      className="!border-gray-300 !rounded-xl !px-3 !py-2 !text-gray-700 !focus:ring-2 !focus:ring-blue-500 !focus:border-blue-500 !shadow-sm cursor-pointer"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 mt-1" />
                </FormItem>
              )}
            />
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hospital"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Hospital" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="hasOwnClinic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md p-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal text-gray-600 hover:text-black">
                Do you own a clinic?
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-[#3fa8e9] hover:bg-[#349cd9]"
        >
          Register as Doctor
        </Button>
      </form>
    </Form>
  );
};

export default SignupDoctor;
