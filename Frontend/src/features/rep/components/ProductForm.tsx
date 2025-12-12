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
import { Checkbox } from "@/components/ui/checkbox";
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

interface Territory {
  id: string;
  name: string;
}

interface Props {
  initialData?: ProductFormValues | null;
  submitAction: (data: FormData) => Promise<unknown>;
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
    defaultValues: initialData ? {
      ...initialData,
      imageUrls: initialData.imageUrls ?? [],
      territoryIds: initialData.territoryIds || [],
      ingredients: initialData.ingredients || [],
    } : {
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
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
    initialData?.imageUrls && Array.isArray(initialData.imageUrls) 
      ? initialData.imageUrls.filter(Boolean)
      : []
  );
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    initialData?.imageUrls && Array.isArray(initialData.imageUrls)
      ? initialData.imageUrls.filter(Boolean)
      : []
  );
  //   const [useCases, setUseCases] = useState<string[]>(initialData?.useCase ?? []);
  const [ingredients, setIngredients] = useState<string[]>(
    initialData?.ingredients ?? []
  );

  const [territories, setTerritories] = useState<Territory[]>([]);
  const [compressing, setCompressing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTerritories()
      .then((res) => {
        if (res.data?.data) {
          setTerritories(res.data.data);
        } else if (res.data) {
          setTerritories(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch(() => {
        toast.error("Failed to load territories");
      });
  }, []);

  // Sync existing images when initialData changes (for edit mode)
  useEffect(() => {
    if (mode === "edit" && initialData?.imageUrls) {
      const imageUrls = Array.isArray(initialData.imageUrls) 
        ? initialData.imageUrls.filter(Boolean)
        : [];
      setExistingImageUrls(imageUrls);
      setPreviewUrls(imageUrls);
    }
  }, [initialData, mode]);

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
    e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith('image/')
    );
    if (files.length === 0) return;

    setCompressing(true);

    const compressedFiles = await Promise.all(
      files.map(async (file) =>
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeImage = (index: number) => {
    const urlToRemove = previewUrls[index];
    
    // Check if it's an existing image (starts with http/https) or a new upload (blob URL)
    const isExistingImage = urlToRemove.startsWith('http://') || urlToRemove.startsWith('https://');
    
    if (isExistingImage) {
      // It's an existing image - remove from existingImageUrls
      setExistingImageUrls((p) => p.filter((url) => url !== urlToRemove));
    } else {
      // It's a new upload (blob URL) - find and remove the corresponding file
      // Count how many blob URLs come before this index
      let blobCount = 0;
      for (let i = 0; i < index; i++) {
        if (!previewUrls[i].startsWith('http://') && !previewUrls[i].startsWith('https://')) {
          blobCount++;
        }
      }
      
      // Remove the file at that position
      if (blobCount < uploadedImages.length) {
        URL.revokeObjectURL(urlToRemove);
        setUploadedImages((p) => {
          const newFiles = [...p];
          newFiles.splice(blobCount, 1);
          return newFiles;
        });
      }
    }
    
    // Remove from preview URLs
    setPreviewUrls((p) => p.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: ProductFormValues): Promise<void> => {
    if (uploadedImages.length === 0 && existingImageUrls.length === 0) {
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

    // Send existing images (for edit mode) - always send if in edit mode to preserve them
    if (mode === "edit") {
      formData.append("existingImages", JSON.stringify(existingImageUrls));
    }

    // Send new uploaded images
    uploadedImages.forEach((file) => formData.append("images", file));

    setLoading(true);
    try {
      await submitAction(formData);
      toast.success(mode === "add" ? "Product added successfully!" : "Product updated successfully!");
      navigate(-1);
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      toast.error(errorMessage || `Failed to ${mode === "add" ? "add" : "update"} product`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-xl shadow-md w-full max-w-2xl">
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(
            (data) => {
              onSubmit(data as ProductFormValues);
            },
            () => {
              toast.error("Please fix the form errors before submitting");
            }
          )} 
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold mb-3">
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </h2>

          {/* IMAGE UPLOAD */}
          <Card>
            <CardContent className="pt-6">
              <Label className="font-medium">Product Images</Label>
              <p className="text-xs text-gray-500">Upload up to 4 images</p>

              <div
                className="border-2 border-dashed mt-3 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onClick={() => document.getElementById("imgUpload")?.click()}
              >
                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                <p className="text-sm mt-2">Browse or drag files here</p>
                <p className="text-xs text-gray-400 mt-1">Supports: JPG, PNG, GIF</p>
                <input
                  multiple
                  accept="image/*"
                  type="file"
                  className="hidden"
                  id="imgUpload"
                  onChange={handleImageUpload}
                />
              </div>

              {compressing && (
                <div className="mt-3 text-center text-sm text-gray-500">
                  Compressing images...
                </div>
              )}

              {previewUrls.length > 0 && (
                <div className="mt-3 flex gap-3 flex-wrap">
                  {previewUrls.map((url, i) => (
                    <div
                      key={i}
                      className="relative w-24 h-24 rounded overflow-hidden border"
                    >
                      <img src={url} alt={`Preview ${i + 1}`} className="object-cover w-full h-full" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white p-1 rounded shadow hover:bg-gray-100 transition"
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

          {/* TERRITORIES */}
          <Card>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="territoryIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Territories (Optional)</FormLabel>
                    <p className="text-xs text-gray-500 mb-3">
                      Select territories where this product should be visible
                    </p>
                    {territories.length === 0 ? (
                      <p className="text-sm text-gray-500">Loading territories...</p>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                        {territories.map((territory) => (
                          <div
                            key={territory.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`territory-${territory.id}`}
                              checked={field.value?.includes(territory.id) || false}
                              onCheckedChange={(checked) => {
                                const currentValues = field.value || [];
                                if (checked) {
                                  field.onChange([...currentValues, territory.id]);
                                } else {
                                  field.onChange(
                                    currentValues.filter((id) => id !== territory.id)
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor={`territory-${territory.id}`}
                              className="text-sm font-medium leading-none cursor-pointer"
                            >
                              {territory.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            <Button 
              type="submit" 
              disabled={loading} 
              className="min-w-[150px]"
            >
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
