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
import { addTerritory, updateTerritory } from "../api/superAdminApi";
import { useAppSelector } from "@/app/hooks";
import { TeritorySchema, TerritorySchemaDTO } from "../Schemas/TerritorySchema";
import toast from "react-hot-toast";

const AddTerritory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = useAppSelector((state) => state.auth.user?.id);

  const state = location.state as {
    existingData?: TerritorySchemaDTO;
    territoryId?: string;
  };

  const existingData = state?.existingData;
  const territoryId = state?.territoryId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TerritorySchemaDTO>({
    resolver: zodResolver(TeritorySchema),
    defaultValues: existingData || { name: "", region: "" },
  });

  const onSubmit = async (values: TerritorySchemaDTO) => {
    try {
      setLoading(true);
      setError(null);

      let res;

      if (territoryId) {
        res = await updateTerritory(territoryId, values);
      } else {
        res = await addTerritory(values);
      }

      if (res?.data?.success) {
        toast.success(
          res.data.data?.message ||
            `Territory ${territoryId ? "updated" : "added"} successfully!`
        );

        await new Promise((resolve) => setTimeout(resolve, 800));
        navigate("/admin/territories");
      } else {
        toast.error(
          res?.data?.data?.message ||
            `Failed to ${territoryId ? "update" : "add"} territory`
        );
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to save territory";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">
        {territoryId ? "Edit Territory" : "Add New Territory"}
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Territory Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter territory name" />
                </FormControl>
                <FormMessage>{fieldState?.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter region" />
                </FormControl>
                <FormMessage>{fieldState?.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            {loading
              ? territoryId
                ? "Updating..."
                : "Adding..."
              : territoryId
              ? "Update Territory"
              : "Add Territory"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddTerritory;
