import { Card } from "@/components/ui/card";
import { Trash2, Pencil, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubscriptionPlan } from "../dto/SubscriptionPlan";
import { motion } from "framer-motion";


type Props = {
  plan: SubscriptionPlan & { id: string };
  onDelete: (id: string) => void;
  onEdit: (plan: SubscriptionPlan & { id: string }) => void;
  onUnlist: (id: string) => void;
};

export default function PlanCard({ plan, onDelete, onEdit, onUnlist }: Props) {
  const isUnlisted = !plan.isActive;

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.18 }}>
      <Card
        className={`h-full flex flex-col rounded-2xl border shadow-sm hover:shadow-xl bg-gradient-to-b from-white via-indigo-50/40 to-white transition-all ${
          isUnlisted
            ? "border-gray-300 opacity-80"
            : "border-indigo-100/70"
        }`}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-indigo-100/70 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-xl tracking-tight text-gray-900">
                {plan.name}
              </h3>
              {isUnlisted && (
                <span className="inline-flex items-center rounded-full bg-gray-200 text-gray-700 text-[11px] font-medium px-2 py-0.5">
                  Not listed
                </span>
              )}
            </div>
            <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1">
              {plan.tenure}
            </span>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold text-indigo-700 leading-none">
              ₹{plan.price}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              per {plan.tenure.toLowerCase()}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col p-6 pt-4">
          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {plan.description}
          </p>

          {/* Features List */}
          <div className="mt-auto bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-indigo-100">
            <h4 className="text-sm font-semibold text-indigo-700 mb-2">
              What&apos;s included
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {plan.features.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="mt-[2px] h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] text-emerald-600 font-bold">
                    ✓
                  </span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="w-full flex gap-2 items-center justify-center border-slate-300"
            onClick={() => onEdit(plan)}
          >
            <Pencil className="h-4 w-4" /> Edit
          </Button>

          <Button
            variant="ghost"
            className={`w-full flex gap-2 items-center justify-center ${
              isUnlisted
                ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800"
                : "text-yellow-700 bg-yellow-50 hover:bg-yellow-100 hover:text-yellow-800"
            }`}
            onClick={() => onUnlist(plan.id)}
          >
            <Archive className="h-4 w-4" />{" "}
            {isUnlisted ? "Relist" : "Unlist"}
          </Button>

          <Button
            variant="destructive"
            className="w-full flex gap-2 items-center justify-center"
            onClick={() => onDelete(plan.id)}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
