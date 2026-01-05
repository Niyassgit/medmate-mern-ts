import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { completeUserProfile, getProfile } from "../api";
import { getTerritories } from "@/features/shared/api/SharedApi";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  IFormInput,
  profileSchema,
} from "../schemas/GuestProfileCompleteSchema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User, Phone, MapPin, Loader2, Lock, Save } from "lucide-react";
import { TerritoryDTO } from "@/features/superAdmin/dto/TerritoryDTO";

interface TerritoryOption {
  value: string;
  label: string;
}

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [territories, setTerritories] = useState<TerritoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const isEdit = location.state?.isEdit || false;

  const form = useForm<IFormInput>({
    resolver: zodResolver(profileSchema),
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        const terrData = await getTerritories();
        if (terrData && terrData.data.data) {
          setTerritories(
            terrData.data.data.map((t: TerritoryDTO) => ({
              value: t.id,
              label: t.name,
            }))
          );
        }

        const profile = await getProfile();
        if (profile) {
          if (profile.name) setValue("name", profile.name);
          if (profile.phone) setValue("phone", profile.phone);

          if (profile.territoryName && profile.territoryName !== "Unknown") {
            const matched = terrData?.data?.data?.find(
              (t: TerritoryDTO) => t.name === profile.territoryName
            );
            if (matched) {
              setValue("territoryId", matched.id);
            }
          }

          if (
            !isEdit &&
            profile.isRegistered &&
            profile.territoryName !== "Unknown"
          ) {
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
  }, [navigate, setValue, isEdit]);

  const onSubmit = async (data: IFormInput) => {
    try {
      await completeUserProfile(data);
      toast.success(
        isEdit ? "Profile updated successfully!" : "Profile completed successfully!"
      );
      navigate(isEdit ? "/guest/profile" : "/guest/dashboard");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to complete profile";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-gray-900">
            {isEdit ? "Edit Profile" : "Complete Profile"}
          </CardTitle>
          <CardDescription className="text-base">
            {isEdit
              ? "Update your personal information below"
              : "Please provide your details to continue"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="John Doe"
                          className="pl-10 text-black"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="+1 234 567 890"
                          type="tel"
                          className="pl-10 text-black"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="territoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Territory</FormLabel>
                    <FormControl>
                      <div className="relative">
                        {/* Wrapper to align with other inputs better if needed, or just use as is */}
                        <div className="relative">
                          <div className="absolute left-3 top-3 z-10 pointer-events-none">
                            <MapPin className="h-4 w-4 text-gray-400" />
                          </div>
                          <Select
                            {...field}
                            options={territories}
                            value={territories.find(
                              (c) => c.value === field.value
                            )}
                            onChange={(val) => field.onChange(val?.value)}
                            placeholder="Select your territory"
                            className="react-select-container"
                            classNamePrefix="react-select"
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                paddingLeft: "2rem", // Make space for icon
                                borderColor: state.isFocused ? "var(--primary)" : "#e2e8f0",
                                boxShadow: state.isFocused ? "0 0 0 1px var(--primary)" : "none",
                                "&:hover": {
                                  borderColor: state.isFocused ? "var(--primary)" : "#cbd5e1",
                                },
                                borderRadius: "var(--radius)",
                                minHeight: "2.5rem",
                              }),
                              input: (base) => ({
                                ...base,
                                color: "#000000",
                                "input:focus": {
                                  boxShadow: "none",
                                },
                              }),
                              singleValue: (base) => ({
                                ...base,
                                color: "#000000",
                              }),
                              option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isFocused
                                  ? "#e2e8f0"
                                  : "#ffffff",
                                color: "#000000",
                              }),
                            }}
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 space-y-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 text-base font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isEdit ? "Update Profile" : "Save & Continue"}
                    </>
                  )}
                </Button>

                {isEdit && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/guest/verify-password")}
                    className="w-full h-11 text-base"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteProfilePage;
