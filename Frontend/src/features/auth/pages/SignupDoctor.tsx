import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

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

type DoctorRegisterValues = {
    name: string,
    email: string,
    phone: string,
    password: string,
    Cpassword: string,
    // departmentId: string,
    // territoryId: string,
    hospital: string,
    registrationId: string,
    licenseImageUrl: File |null,
    opHours: string,
    hasOwnClinic: boolean
}


const SignupDoctor = () => {
    const navigate=useNavigate()

    const form = useForm<DoctorRegisterValues>({
        defaultValues: { 
            name: "",
            email: "",
            phone: "",
            password: "", 
            Cpassword:"",
            // departmentId:"",
            // territoryId:"",
            hospital:"",
            registrationId:"",
            licenseImageUrl:null,
            opHours:"",
            hasOwnClinic:false
         
        
        },
    });

    const onSubmit =async (values: DoctorRegisterValues) => {


        if(values.password !==values.Cpassword){
            alert("Passwords do not match");
            return;
        }

        try {
            const formData=new FormData();
            formData.append("name",values.name);
            formData.append("email",values.email);
            formData.append("phone",values.phone);
            formData.append("password",values.password);
            // formData.append("departmentId",values.departmentId);
            // formData.append("territoryId",values.territoryId);
            formData.append("hospitalId",values.hospital);
            formData.append("registrationId",values.registrationId);
            if(values.licenseImageUrl) formData.append("licenseImageUrl",values.licenseImageUrl);
            formData.append("opHours",values.opHours);
            formData.append("hasOwnClinic",String(values.hasOwnClinic));
            
           
            await registerDoctor(formData);
            alert ( "Doctor registered successfully🚀");
            
            navigate("/auth/login",{ replace: true });

        } catch (error : any) {
            console.error(error);
            alert(error.response?.data?.message || "Registration failed");
        }


    }

    return (

        <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

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


                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your password" {...field} />
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
                                <FormLabel>Comfirm Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Repeat your password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* <FormField
                        control={form.control}
                        name="territoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Territory" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                    <FormField
                        control={form.control}
                        name="opHours"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Choose your op time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />   
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
                                   checked ={field.value}
                                   onCheckedChange ={field.onChange}
                                   />
                                </FormControl>
                                 <FormLabel className="text-sm font-normal text-gray-600 hover:text-black">Do you own a clinic?</FormLabel>
                                <FormMessage />
                            </FormItem>
                        )}
                    />   

                <Button type="submit" className="w-full bg-[#3fa8e9] hover:bg-[#349cd9]" >
                    Register as Doctor
                </Button>

            </form>
        </Form>

    )
}

export default SignupDoctor;
