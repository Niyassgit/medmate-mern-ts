import {
  ProductPostFormValues,
  productPostSchema,
} from "../schemas/ProductPostSchema";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TagInput } from "./TagInput";
import { useNavigate } from "react-router-dom";
import { compressImage } from "@/lib/compressImage";

interface ProductFormProps {
  heading?: string;
  defaultValues?: ProductPostFormValues & {
    useCases?: string[];
    ingredients?: string[];
  };
  onSubmit: (values: ProductPostFormValues, images: File[]) => void;
}

const PostForm = ({ defaultValues, onSubmit, heading }: ProductFormProps) => {
  const navigate = useNavigate();
  const [existingImages, setExistingImages] = useState<string[]>(
    defaultValues?.existingImages || []
  );
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([
    ...(defaultValues?.existingImages || []),
  ]);

  const [useCases, setUseCases] = useState<string[]>(
    defaultValues?.useCases || []
  );
  const [ingredients, setIngredients] = useState<string[]>(
    defaultValues?.ingredients || []
  );
  const [compressing, setCompressing] = useState(false);

  const form = useForm<ProductPostFormValues>({
    resolver: zodResolver(productPostSchema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      brand: "",
      territory: "",
      termsOfUse: "",
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setCompressing(true);

    const compressedFiles = await Promise.all(
      Array.from(files).map(async (file) => {
        const compressed =
          file.size > 600 * 1024 ? await compressImage(file) : file;
        return compressed;
      })
    );

    setUploadedImages((prev) => [...prev, ...compressedFiles]);
    setPreviewUrls((prev) => [
      ...prev,
      ...compressedFiles.map((file) => URL.createObjectURL(file)),
    ]);

    setCompressing(false);
  };
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setCompressing(true);

    const compressedFiles = await Promise.all(
      files.map(async (file) => {
        const compressed =
          file.size > 600 * 1024 ? await compressImage(file) : file;
        return compressed;
      })
    );

    setUploadedImages((prev) => [...prev, ...compressedFiles]);
    setPreviewUrls((prev) => [
      ...prev,
      ...compressedFiles.map((file) => URL.createObjectURL(file)),
    ]);

    setCompressing(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const removeImage = (index: number) => {
    const imageUrl = previewUrls[index];

    if (existingImages.includes(imageUrl)) {
      setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
    } else {
      setUploadedImages((prev) =>
        prev.filter((file) => URL.createObjectURL(file) !== imageUrl)
      );
    }
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setCompressing(false);
  };

  const handleSubmit = (values: ProductPostFormValues) => {
    onSubmit(
      { ...values, useCases, ingredients, existingImages },
      uploadedImages
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-4xl px-6 py-8">
        {heading && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{heading}</h1>
            <p className="text-sm text-muted-foreground">
              Fill out the details below to add a new product to your catalog
            </p>
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
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
                          <Input placeholder="Enter territory" {...field} />
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
                <div
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 p-12"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 text-sm font-medium text-foreground">
                    Drag & drop images or{" "}
                    <label
                      htmlFor="fileUpload"
                      className="cursor-pointer text-primary hover:underline"
                    >
                      browse
                    </label>
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
                {compressing && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    <span className="ml-2 text-sm text-muted-foreground">
                      Compressing images...
                    </span>
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
                  </div>
                  <div>
                    <Label>Ingredients</Label>
                    <TagInput
                      value={ingredients}
                      onChange={setIngredients}
                      placeholder="Type an ingredient and press Enter"
                    />
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

            {/* Submit */}
            <div className="flex justify-center pt-4 gap-2 mb-10">
              <Button onClick={() => navigate(-1)} size="lg" variant="outline">
                Cancel
              </Button>
              <Button type="submit" size="lg" className="min-w-[200px]">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default PostForm;
