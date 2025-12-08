import React, { useState, useEffect } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { TagInput } from "./TagInput";
import {
  productValidateSchema,
  ProductFormValues,
} from "../schemas/ProductSchema";
import { compressImage } from "@/lib/compressImage";
import toast from "react-hot-toast";
import { getTerritories } from "@/features/shared/api/SharedApi";
import { useNavigate } from "react-router-dom";

interface Props {
  initialData?: ProductFormValues | null;
  submitAction: (data: FormData) => Promise<any>;
  mode: "add" | "edit";
}

export default function ProductForm({
  initialData,
  submitAction,
  mode,
}: Props) {
  const navigate = useNavigate();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productValidateSchema),
    defaultValues: initialData ?? {
      name: "",
      brand: "",
      mrp: 0,
      ptr: 0,
      territoryIds: [],
      //   useCase: [],
      ingredients: [],
      imageUrls: [],
    },
  });

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    initialData?.imageUrls ?? []
  );
  //   const [useCases, setUseCases] = useState<string[]>(initialData?.useCase ?? []);
  const [ingredients, setIngredients] = useState<string[]>(
    initialData?.ingredients ?? []
  );

  const [territories, setTerritories] = useState<any[]>([]);
  const [compressing, setCompressing] = useState(false);
  const [loading, setLoading] = useState(false);

  // fetch territories once
  useEffect(() => {
    getTerritories().then((res) => {
      if (res.data?.data) setTerritories(res.data.data);
    });
  }, []);

  /* Image Upload + Compression */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setCompressing(true);

    const compressedFiles = await Promise.all(
      Array.from(files).map(async (file) =>
        file.size > 600 * 1024 ? await compressImage(file) : file
      )
    );

    setUploadedImages((p) => [...p, ...compressedFiles]);
    setPreviewUrls((p) => [
      ...p,
      ...compressedFiles.map((f) => URL.createObjectURL(f)),
    ]);

    setCompressing(false);
  };

  const removeImage = (index: number) => {
    setUploadedImages((p) => p.filter((_, i) => i !== index));
    setPreviewUrls((p) => p.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: ProductFormValues) => {
    if (uploadedImages.length === 0 && previewUrls.length === 0) {
      toast.error("Upload at least 1 product image");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("brand", values.brand);
    formData.append("mrp", String(values.mrp));
    formData.append("ptr", String(values.ptr));

    const territoryIds = values.territoryIds ?? [];
    if (territoryIds.length > 0) {
      formData.append("territoryIds", JSON.stringify(territoryIds));
    }

    // if (useCases.length > 0)
    //   formData.append("useCase", JSON.stringify(useCases));

    if (ingredients.length > 0)
      formData.append("ingredients", JSON.stringify(ingredients));

    uploadedImages.forEach((file) => formData.append("images", file));

    setLoading(true);
    await submitAction(formData);
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-xl shadow-md w-full max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-2xl font-semibold mb-3">
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </h2>

          {/* IMAGE UPLOAD */}
          <Card>
            <CardContent className="pt-6">
              <Label className="font-medium">Product Images</Label>
              <p className="text-xs text-gray-500">Upload up to 4 images</p>

              <div className="border-2 border-dashed mt-3 rounded-lg p-6 text-center cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                <p className="text-sm">Browse or drag files here</p>
                <input
                  multiple
                  accept="image/*"
                  type="file"
                  className="hidden"
                  id="imgUpload"
                  onChange={handleImageUpload}
                />
              </div>

              {previewUrls.length > 0 && (
                <div className="mt-3 flex gap-3 flex-wrap">
                  {previewUrls.map((url, i) => (
                    <div
                      key={i}
                      className="relative w-24 h-24 rounded overflow-hidden border"
                    >
                      <img src={url} className="object-cover w-full h-full" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white p-1 rounded shadow"
                        onClick={() => removeImage(i)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* BASIC FIELDS */}
          <Card>
            <CardContent className="space-y-5 pt-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="mrp"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>MRP ₹ *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ptr"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>PTR ₹ *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* USE CASES & INGREDIENTS */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              {/* <div><Label>Use Cases</Label><TagInput value={useCases} onChange={setUseCases}/></div> */}
              <div>
                <Label>Ingredients</Label>
                <TagInput value={ingredients} onChange={setIngredients} />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center pt-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[150px]">
              {loading
                ? "Saving..."
                : mode === "add"
                ? "Add Product"
                : "Update Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
