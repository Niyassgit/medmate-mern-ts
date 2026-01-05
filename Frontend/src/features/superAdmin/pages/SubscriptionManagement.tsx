import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  subscriptionPlanSchema,
  SubscriptionPlanBody,
} from "../Schemas/SubscriptionPlanSchema";
import { SubscriptionPlan } from "../dto/SubscriptionPlan";
import {
  createSubscriptionPlan,
  deleteList,
  getDepartments,
  toggleListPlan,
  updateSubscriptionPlan,
  getFeaturesList,
} from "../api/superAdminApi";
import { Feature } from "../dto/Feature";
import PlanCard from "../components/PlanCard";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Plan = SubscriptionPlan & { id: string };

const SubscriptionManagement = () => {
  const navigate=useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [availableFeatures, setAvailableFeatures] = useState<Feature[]>([]);
  const [loadingFeatures, setLoadingFeatures] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("Confirm Action");
  const [confirmMessage, setConfirmMessage] = useState("Are you sure?");
  const [pendingAction, setPendingAction] = useState<null | {
    type: "delete" | "toggle";
    planId: string;
  }>(null);

  const form = useForm<SubscriptionPlanBody>({
    resolver: zodResolver(subscriptionPlanSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      tenure: "Monthly",
      features: [],
    },
  });

  const { register, handleSubmit, formState, setValue, watch } = form;
  const { errors } = formState;
  const selectedFeatureIds = watch("features") as string[];

  const toggleFeature = (featureId: string) => {
    const current = selectedFeatureIds || [];
    if (current.includes(featureId)) {
      setValue("features", current.filter((id) => id !== featureId));
    } else {
      setValue("features", [...current, featureId]);
    }
  };

  const onSubmit = async (values: SubscriptionPlanBody) => {
    try {

      const payload = {
        name: values.name,
        description: values.description,
        price: parseFloat(values.price),
        tenure: values.tenure,
        features: values.features, 
      };

      if (editingPlan) {
        await updateSubscriptionPlan(editingPlan.id, payload);
        toast.success("Plan updated successfully");
        setEditingPlan(null);
      } else {
        const res = await createSubscriptionPlan(payload);
        toast.success(res.message || res.data?.message || "Plan created successfully");
      }

      form.reset();
      fetchPlans();
    } catch (error: unknown) {
      const errorMessage = 
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 
        "Failed to save plan";
      toast.error(errorMessage);
    }
  };

  const performDelete = async (id: string) => {
    try {
      const res = await deleteList(id);

      if (res.success) {
        setPlans((prev) => prev.filter((plan) => plan.id !== id));
        toast.success(res.message || "Plan deleted successfully");
      } else {
        toast.error(res.message || "Failed to delete plan");
      }
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || "Internal server error";
      toast.error(errorMessage);
    }
  };

  const handleDelete = (id: string) => {
    setPendingAction({ type: "delete", planId: id });
    setConfirmTitle("Delete Subscription Plan");
    setConfirmMessage(
      "Are you sure you want to delete this subscription plan? This action cannot be undone."
    );
    setConfirmOpen(true);
  };

  const fetchPlans = async () => {
    try {
      const res = await getDepartments();
      setPlans(res.data);
    } catch {
      toast.error("Failed to load subscription plans");
    }
  };

  const fetchFeatures = async () => {
    try {
      setLoadingFeatures(true);
      const res = await getFeaturesList();
      if (res.success && res.data) {
        setAvailableFeatures(res.data);
      }
    } catch (error: unknown) {
      const errorMessage = 
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 
        "Failed to fetch features";
      toast.error(errorMessage);
    } finally {
      setLoadingFeatures(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchFeatures();
  }, []);

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);

    setValue("name", plan.name);
    setValue("description", plan.description);
    setValue("price", String(plan.price));
    setValue("tenure", plan.tenure);
    
    const featureKeys = plan.features || [];
    const featureIds = availableFeatures
      .filter((f) => featureKeys.includes(f.key))
      .map((f) => f.id);
    setValue("features", featureIds);
  };

  const performToggleListing = async (planId: string) => {
    try {
      const res = await toggleListPlan(planId);

      if (res.success) {
        setPlans((prev) =>
          prev.map((plan) =>
            plan.id === planId ? { ...plan, isActive: !plan.isActive } : plan
          )
        );

        toast.success(res.data || "Plan status updated");
      } else {
        toast.error(res.data || "Failed to update listing");
      }
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || "Internal server error";
      toast.error(errorMessage);
    }
  };

  const handleListing = (planId: string) => {
    const current = plans.find((p) => p.id === planId);
    const goingToList = current ? !current.isActive : true;

    const message = goingToList
      ? "Are you sure you want to list this subscription plan? It will become visible to users."
      : "Are you sure you want to unlist this subscription plan? It will no longer be visible to users.";

    setPendingAction({ type: "toggle", planId });
    setConfirmTitle(
      goingToList ? "List Subscription Plan" : "Unlist Subscription Plan"
    );
    setConfirmMessage(message);
    setConfirmOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
          <div className="flex gap-2">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2" 
              onClick={() => navigate(`/admin/feature-management`)}
            >
              <Settings className="w-4 h-4" />
              Manage Features
            </Button>
            <Button 
              className="bg-[#f17175] hover:bg-[#a81519] flex items-center gap-2" 
              onClick={()=>navigate(`/admin/subscription-management/list`)}
            >
          View All Subscribers
          <ArrowRight className="w-4 h-4" />
        </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Plan Name *</Label>
                  <Input {...register("name")} placeholder="Premium" />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Price (₹) *</Label>
                  <Input
                    type="number"
                    {...register("price")}
                    placeholder="399.00"
                  />
                  {errors.price && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>Billing Period *</Label>
                <select
                  {...register("tenure")}
                  className="w-full h-10 border rounded-md px-3"
                >
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Yearly</option>
                </select>
                {errors.tenure && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.tenure.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Description *</Label>
                <Textarea {...register("description")} rows={2} />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                <Label>Features *</Label>
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-blue-600"
                    onClick={() => navigate(`/admin/feature-management`)}
                  >
                    Manage Features
                  </Button>
                </div>
                {loadingFeatures ? (
                  <p className="text-sm text-gray-500">Loading features...</p>
                ) : availableFeatures.length === 0 ? (
                  <div className="p-4 border rounded-md bg-yellow-50">
                    <p className="text-sm text-yellow-800">
                      No features available. Please{" "}
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/feature-management`)}
                        className="text-blue-600 underline"
                      >
                        create features
                      </button>{" "}
                      first.
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                    <div className="space-y-2">
                      {availableFeatures.map((feature) => (
                        <label
                          key={feature.id}
                          className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFeatureIds?.includes(feature.id) || false}
                            onChange={() => toggleFeature(feature.id)}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{feature.key}</div>
                            <div className="text-xs text-gray-500">
                              {feature.description}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                {errors.features && (!selectedFeatureIds || selectedFeatureIds.length === 0) && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.features.message}
                  </p>
                )}
                {selectedFeatureIds && selectedFeatureIds.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">
                      Selected: {selectedFeatureIds.length} feature(s)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedFeatureIds.map((featureId) => {
                        const feature = availableFeatures.find((f) => f.id === featureId);
                        return feature ? (
                          <span
                            key={featureId}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
                  >
                            {feature.key}
                            <button
                              type="button"
                              onClick={() => toggleFeature(featureId)}
                              className="hover:text-blue-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              <Button className="w-full" type="submit">
                {editingPlan ? "Update Plan" : "Add Plan"}
              </Button>

              {editingPlan && (
                <Button
                  className="w-full mt-2"
                  variant="secondary"
                  onClick={() => {
                    setEditingPlan(null);
                    form.reset();
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your Plans ({plans.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {plans.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No plans yet</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onUnlist={(id) => handleListing(id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        onConfirm={async () => {
          if (!pendingAction) {
            setConfirmOpen(false);
            return;
          }

          const { type, planId } = pendingAction;

          if (type === "delete") {
            await performDelete(planId);
          } else if (type === "toggle") {
            await performToggleListing(planId);
          }

          setPendingAction(null);
          setConfirmOpen(false);
        }}
        onCancel={() => {
          setPendingAction(null);
          setConfirmOpen(false);
        }}
        confirmButtonClassName="bg-[#e6686c] text-white hover:bg-[#ae3236]"
      />
    </div>
  );
};

export default SubscriptionManagement;
