import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { addTerritory } from "../api/superAdminApi";
import { useSelector } from "react-redux";
import { TeritorySchema, TerritorySchemaDTO } from "../Schemas/TerritorySchema"; // import your schema

const AddTerritory = () => {
  const navigate = useNavigate();
  const userId = useSelector((state: any) => state.auth.user?.id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TerritorySchemaDTO>({
    resolver: zodResolver(TeritorySchema),
    defaultValues: { name: "", region: "" },
  });

  const onSubmit = async (values: TerritorySchemaDTO) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("region", values.region);

    try {
      setLoading(true);
      setError(null);
      await addTerritory(userId, formData);
      navigate("/admin/territories");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create territory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">
        Add New Territory
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
            {loading ? "Adding..." : "Add Territory"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddTerritory;
