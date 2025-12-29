import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { z } from "zod";
import {
  createFeature,
  deleteFeature,
  getFeaturesList,
  updateFeature,
} from "../api/superAdminApi";
import { Feature } from "../dto/Feature";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

const featureSchema = z.object({
  key: z.string().min(1, "Feature key is required"),
  description: z.string().min(1, "Description is required"),
});

type FeatureFormData = z.infer<typeof featureSchema>;

const FeatureManagement = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const form = useForm<FeatureFormData>({
    resolver: zodResolver(featureSchema),
    defaultValues: {
      key: "",
      description: "",
    },
  });

  const { register, handleSubmit, formState, setValue, reset } = form;
  const { errors } = formState;

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const res = await getFeaturesList();
      if (res.success && res.data) {
        setFeatures(res.data);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch features");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const onSubmit = async (values: FeatureFormData) => {
    try {
      if (editingFeature) {
        await updateFeature(editingFeature.id, values);
        toast.success("Feature updated successfully");
        setEditingFeature(null);
      } else {
        await createFeature(values);
        toast.success("Feature created successfully");
      }
      reset();
      fetchFeatures();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to save feature"
      );
    }
  };

  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature);
    setValue("key", feature.key);
    setValue("description", feature.description);
  };

  const handleCancelEdit = () => {
    setEditingFeature(null);
    reset();
  };

  const handleDeleteClick = (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const performDelete = async () => {
    if (!pendingDeleteId) return;

    try {
      await deleteFeature(pendingDeleteId);
      toast.success("Feature deleted successfully");
      setFeatures((prev) => prev.filter((f) => f.id !== pendingDeleteId));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete feature"
      );
    } finally {
      setPendingDeleteId(null);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <h1 className="text-2xl font-bold">Feature Management</h1>

        <Card>
          <CardHeader>
            <CardTitle>
              {editingFeature ? "Edit Feature" : "Create New Feature"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label>Feature Key *</Label>
                <Input
                  {...register("key")}
                  placeholder="e.g., VIDEO_CALL, ANALYTICS, PREMIUM_SUPPORT"
                  disabled={!!editingFeature}
                />
                {errors.key && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.key.message}
                  </p>
                )}
                {editingFeature && (
                  <p className="text-xs text-gray-500 mt-1">
                    Feature key cannot be changed after creation
                  </p>
                )}
              </div>

              <div>
                <Label>Description *</Label>
                <Textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Describe what this feature enables..."
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingFeature ? "Update Feature" : "Create Feature"}
                </Button>
                {editingFeature && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Features ({features.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-500 text-center py-6">Loading...</p>
            ) : features.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No features yet. Create your first feature above.
              </p>
            ) : (
              <div className="space-y-3">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-start justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-lg">
                          {feature.key}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Created: {new Date(feature.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(feature)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(feature.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <ConfirmDialog
          open={confirmOpen}
          title="Delete Feature"
          message="Are you sure you want to delete this feature? This action cannot be undone. Note: This will remove the feature from all subscription plans that use it."
          onConfirm={performDelete}
          onCancel={() => {
            setPendingDeleteId(null);
            setConfirmOpen(false);
          }}
          confirmButtonClassName="bg-[#e6686c] text-white hover:bg-[#ae3236]"
        />
      </div>
    </div>
  );
};

export default FeatureManagement;

