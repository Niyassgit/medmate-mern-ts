import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { createDepartment, updateDepartment } from "../api/superAdminApi";
import {
  DepartmentSchema,
  DepartmentSchemaDTO,
} from "../Schemas/DepartmentSchema";

const CreateDepartment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as {
    existingData?: DepartmentSchemaDTO;
    departmentId?: string;
  };

  const existingData = state?.existingData;
  const departmentId = state?.departmentId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<DepartmentSchemaDTO>({
    resolver: zodResolver(DepartmentSchema),
    defaultValues: existingData || {
      name: "",
      isActive: true,
    },
  });

  const onSubmit = async (values: DepartmentSchemaDTO) => {
    try {
      setLoading(true);
      setError(null);
      let res;

      if (departmentId) {
        res = await updateDepartment(departmentId, values);
      } else {
        res = await createDepartment(values);
      }

      const isSuccess = res?.data?.success || res?.data?.succes;
      if (isSuccess) {
        toast.success(
          res.data.message ||
            `Department ${departmentId ? "updated" : "added"} successfully!`
        );
        await new Promise((resolve) => setTimeout(resolve, 800));
        navigate("/admin/departments");
      } else {
        toast.error(res.data.message || "Failed to save department");
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string })?.message || "Internal server error";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">
        {departmentId ? "Edit Department" : "Add New Department"}
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Department Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Department Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter department name" />
                </FormControl>
                <FormMessage>{fieldState?.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Status (Active/Inactive) */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select
                    className="border border-gray-300 rounded-lg p-2 w-full"
                    value={field.value ? "true" : "false"}
                    onChange={(e) => field.onChange(e.target.value === "true")}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" disabled={loading}>
            {loading
              ? departmentId
                ? "Updating..."
                : "Adding..."
              : departmentId
              ? "Update Department"
              : "Add Department"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateDepartment;
