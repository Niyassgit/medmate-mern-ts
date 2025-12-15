import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { completeUserProfile, getProfile } from "../api";
import { getTerritories } from "@/features/shared/api/SharedApi";
import Select from "react-select";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

interface TerritoryOption {
  value: string;
  label: string;
}

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .regex(/^[0-9]+$/, "Phone number must be digits")
    .min(10, "Phone number must be at least 10 digits"),
  territoryId: z.string().min(1, "Territory is required"),
});

type IFormInput = z.infer<typeof profileSchema>;

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const [territories, setTerritories] = useState<TerritoryOption[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        const terrData = await getTerritories();
        if (terrData && terrData.data.data) {
          setTerritories(
            terrData.data.data.map((t: any) => ({
              value: t.id,
              label: t.name,
            }))
          );
        }

        const profile = await getProfile();
        console.log("profile details:",profile);
        if (profile) {
          if (profile.name) setValue("name", profile.name);
          if (profile.phone) setValue("phone", profile.phone);
          if (profile.isRegistered && profile.territoryName !== "Unknown") {
            navigate("/guest/profile");
          }
        }
      } catch (error) {
        console.error("Failed to load initial data", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate, setValue]);

  const onSubmit = async (data: IFormInput) => {
    try {
      await completeUserProfile(data);
      toast.success("Profile completed successfully!");
      navigate("/guest/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to complete profile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Complete Your Profile
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              {...register("name")}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
             focus:outline-none focus:ring-blue-500 focus:border-blue-500 
             text-black"
              placeholder="Enter your name"
            />

            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              {...register("phone")}
              type="tel"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
             focus:outline-none focus:ring-blue-500 focus:border-blue-500 
             text-black"
              placeholder="Enter your phone"
            />

            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Territory
            </label>
            <Controller
              name="territoryId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={territories}
                  value={territories.find((c) => c.value === field.value)}
                  onChange={(val) => field.onChange(val?.value)}
                  placeholder="Select Territory"
                  className="mt-1"
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#ffffff",
                      color: "#000000",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "#000000",
                    }),
                    input: (base) => ({
                      ...base,
                      color: "#000000",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? "#E5E7EB" : "#ffffff",
                      color: "#000000",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#6B7280", // gray
                    }),
                  }}
                />
              )}
            />

            {errors.territoryId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.territoryId.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
