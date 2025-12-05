import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
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
} from "../api/superAdminApi";
import PlanCard from "../components/PlanCard";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Plan = SubscriptionPlan & { id: string };

const SubscriptionManagement = () => {
  const navigate=useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [currentFeature, setCurrentFeature] = useState("");

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
  const features = watch("features");

  const addFeature = () => {
    if (!currentFeature.trim()) return;
    const updated = [...features, currentFeature.trim()];
    setValue("features", updated);
    setCurrentFeature("");
  };

  const removeFeature = (index: number) => {
    const updated = features.filter((_, i) => i !== index);
    setValue("features", updated);
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
        toast.success(res.message || "Plan created successfully");
      }

      form.reset();
      fetchPlans();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save plan");
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
    } catch (error: any) {
      toast.error(error?.message || "Internal server error");
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
    } catch (error) {
      toast.error("Failed to load subscription plans");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);

    setValue("name", plan.name);
    setValue("description", plan.description);
    setValue("price", String(plan.price));
    setValue("tenure", plan.tenure);
    setValue("features", plan.features);
  };

  const performToggleListing = async (planId: string) => {
    const current = plans.find((p) => p.id === planId);
    const goingToList = current ? !current.isActive : true;

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
    } catch (error: any) {
      toast.error(error?.message || "Internal server error");
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
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        <Button className="bg-[#f17175] hover:bg-[#a81519] flex items-center gap-2" onClick={()=>navigate(`/admin/subscription-management/list`)}>
          View All Subscribers
          <ArrowRight className="w-4 h-4" />
        </Button>

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
                <Label>Features *</Label>
                <div className="flex gap-2">
                  <Input
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    placeholder="Type feature and press Add"
                  />
                  <Button type="button" onClick={addFeature} variant="outline">
                    Add
                  </Button>
                </div>
                {errors.features && features.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.features.message}
                  </p>
                )}
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-blue-50 border rounded-md mt-2"
                  >
                    <span className="text-sm">{feature}</span>
                    <Trash2
                      className="h-4 w-4 text-red-500 cursor-pointer"
                      onClick={() => removeFeature(index)}
                    />
                  </div>
                ))}
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
