"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TagInput } from "../components/TagInput";
import { useNavigate } from "react-router-dom";
import {
  productPostSchema,
  ProductPostFormValues,
} from "../schemas/ProductPostSchema";
import { addPost } from "../api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const AddPost = () => {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [useCases, setUseCases] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const id = useSelector((state: any) => state.auth.user?.id);

  const form = useForm<ProductPostFormValues>({
    resolver: zodResolver(productPostSchema),
    defaultValues: {
      title: "",
      description: "",
      brand: "",
      territory: "",
      termsOfUse: "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setUploadedImages((prev) => [...prev, ...fileArray]);

      const urls = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...urls]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      const fileArray = Array.from(files);
      setUploadedImages((prev) => [...prev, ...fileArray]);
      const urls = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...urls]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: ProductPostFormValues) => {
    const formData = new FormData();
    console.log("incrediants and usecase:",ingredients,useCases);

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("brand", values.brand);
    formData.append("territory", values.territory || "");
    formData.append("termsOfUse", values.termsOfUse);
    formData.append("useCases", JSON.stringify(useCases));
    formData.append("ingredients", JSON.stringify(ingredients));


    uploadedImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await addPost(id, formData);
      if (res.data.success) {
        toast.success(res.data.message || "Post uploaded successfully");
        setTimeout(() => navigate("/rep/dashboard"), 2000);
      } else {
        toast.error(res.data.message || "Failed to post Feed");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add product.Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Add New Product
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill out the details below to add a new product to your catalog
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="mb-6 text-xl font-semibold text-foreground">
                  Basic Information
                </h2>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a detailed description..."
                            className="min-h-[120px]"
                            {...field}
                          />
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
                          <Input placeholder="Enter brand name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="territory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Territory (Optional)</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select territory" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="global">Global</SelectItem>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                              <SelectItem value="eu">European Union</SelectItem>
                              <SelectItem value="asia">Asia Pacific</SelectItem>
                              <SelectItem value="latam">
                                Latin America
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product Media */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  Product Media
                </h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  Upload high-quality images of your product (max 5)
                </p>

                <div
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 p-12"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 text-sm font-medium text-foreground">
                    Drag & drop your images, or{" "}
                    <label
                      htmlFor="fileUpload"
                      className="cursor-pointer text-primary hover:underline"
                    >
                      browse
                    </label>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG and GIF files are allowed
                  </p>
                  <input
                    id="fileUpload"
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>

                {previewUrls.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-4">
                    {previewUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative h-24 w-24 overflow-hidden rounded-lg border border-border"
                      >
                        <img
                          src={url}
                          alt={`preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-1 top-1 rounded-full bg-background p-1 shadow-sm hover:bg-muted"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Use Cases & Ingredients */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="mb-6 text-xl font-semibold text-foreground">
                  Use Cases & Ingredients
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label>Use Cases</Label>
                    <TagInput
                      value={useCases}
                      onChange={setUseCases}
                      placeholder="Type a use case and press Enter"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Add multiple use cases by typing and pressing Enter
                    </p>
                  </div>

                  <div>
                    <Label>Ingredients</Label>
                    <TagInput
                      value={ingredients}
                      onChange={setIngredients}
                      placeholder="Type an ingredient and press Enter"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Add multiple ingredients by typing and pressing Enter
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms of Use */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="mb-6 text-xl font-semibold text-foreground">
                  Terms of Use
                </h2>

                <FormField
                  control={form.control}
                  name="termsOfUse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms & Conditions *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your product's terms of use..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center pt-4 gap-2">
              <Button
                type="button"
                size="lg"
                className="bg-transparent hover:bg-gray-50 hover:text-gray-800 text-black border border-black"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" size="lg" className="min-w-[200px]">
                Submit Product
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default AddPost;
