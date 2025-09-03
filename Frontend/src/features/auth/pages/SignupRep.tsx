import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormItem,
    FormField,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form";
import { registerRep } from "../api";
import { useNavigate } from "react-router-dom";


interface RegisterMedicalRepDTO {
    name: string
    email: string
    phone: string
    password?: string
    Cpassword: string,
    companyName: string
    // territoryId: string
    companyLogoUrl?: File | null
    employeeId: string
    // departmentId?: string
}


const SignupRep = () => {

    const navigate = useNavigate()
    const form = useForm<RegisterMedicalRepDTO>({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            Cpassword: "",
            companyName: "",
            companyLogoUrl: null,
            employeeId: "",
            // territoryId: "",
            // departmentId: ""

        }
    })

    const onSubmit = async (data: RegisterMedicalRepDTO) => {

        console.log("Rep Registration Data:", data)

        if (data.password !== data.Cpassword) {
            alert("Password do not match");
            return;
        }

        try {

            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("phone", data.phone);
            formData.append("companyName", data.companyName);
            formData.append("password", data.password);
            formData.append("employeeId", data.employeeId);
            if (data.companyLogoUrl) formData.append("companyLogoUrl", data.companyLogoUrl);

            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }


            await registerRep(formData);
            alert("User has been Registered Successfully🚀");
            navigate('/auth/login',{replace:true});
          
        } catch (error :any) {
            console.error(error);
            alert(error.response?.data?.message || "Registration failed");
        }


    }


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
                                    <Input type="password" placeholder="Enter your password" {...field} />
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
                                    <Input type="password" placeholder="Repeat your password" {...field} />
                                </FormControl>
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

                    {/* <FormField
                        control={form.control}
                        name="departmentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Department</FormLabel>
                                <FormControl>
                                    <Input placeholder="Department" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

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
                                                const file = e.target.files?.[0] || null
                                                field.onChange(file)
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
    )

};

export default SignupRep;
