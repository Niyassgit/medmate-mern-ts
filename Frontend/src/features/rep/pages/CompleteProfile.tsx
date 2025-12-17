import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import {
  CompleteRepProfileSchema,
  CompleteRepProfileDTO,
} from "../schemas/CompleteRepProfileDTO";
import { getProfileRep, completeProfile } from "../api";
import { useEffect, useState } from "react";
import { DynamicList } from "@/features/doctor/components/DynamicList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import {
  getDepartments,
  getTerritories,
} from "@/features/shared/api/SharedApi";

export default function CompleteRepProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);
  const [territories, setTerritories] = useState<
    { id: string; name: string }[]
  >([]);

  const form = useForm<CompleteRepProfileDTO>({
    resolver: zodResolver(CompleteRepProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
      companyName: "",
      employeeId: "",
      departmentId: "",
      territories: [],
      about: "",
      companyLogoUrl: "",
      educations: [{ degree: "", institute: "", year: null }],
      certificates: [{ name: "", issuedBy: "", year: null }],
    },
  });

  useEffect(() => {
    async function fetchDropdownData() {
      try {
        const deptData = await getDepartments();
        setDepartments(deptData.data.data);

        const terrData = await getTerritories();
        setTerritories(terrData.data.data);
      } catch (error) {
        toast.error("Failed to load departments or territories");
      }
    }
    fetchDropdownData();
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await getProfileRep(id!);
        const data = response.data;
        const selectedTerritories = territories
          .filter((t) => data.territoryNames.includes(t.name))
          .map((t) => t.id);

        const selectedDepartment = departments.find(
          (d) => d.name === data.departmentName
        )?.id;

        form.reset({
          name: data.name ?? "",
          phone: data.phone ?? "",
          companyName: data.companyName ?? "",
          employeeId: data.employeeId ?? "",
          about: data.about ?? "",
          companyLogoUrl: data.companyLogoUrl ?? "",
          departmentId: selectedDepartment ?? "",
          territories: selectedTerritories ?? [],
          educations:
            data.educations?.length > 0
              ? data.educations
              : [{ degree: "", institute: "", year: null }],
          certificates:
            data.certificates?.length > 0
              ? data.certificates
              : [{ name: "", issuedBy: "", year: null }],
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch profile");
      }
    }

    if (id && territories.length && departments.length) fetchProfile();
  }, [id, form, territories, departments]);

  const handleFormSubmit = (values: CompleteRepProfileDTO) => {
    const formPayload = new FormData();

    formPayload.append("name", values.name);
    formPayload.append("phone", values.phone);
    formPayload.append("companyName", values.companyName || "");
    formPayload.append("employeeId", values.employeeId || "");
    formPayload.append("about", values.about || "");
    formPayload.append("departmentId", values.departmentId || "");
    values.territories.forEach((id) => {
      formPayload.append("territories[]", id);
    });

    formPayload.append("educations", JSON.stringify(values.educations));
    formPayload.append("certificates", JSON.stringify(values.certificates));

    if (logoFile) {
      formPayload.append("companyLogoUrl", logoFile);
    }

    setFormData(formPayload);
    setOpenConfirm(true);
  };

  const confirmProfileUpdate = async () => {
    if (!formData) return;

    try {
      const res = await completeProfile(id!, formData);
      toast.success(res.data.message || "Profile saved successfully");
      navigate("/rep/profile");
    } catch (err: any) {
      if (err.response) {
        toast.error(err.response.data.message || "Failed to save profile");
      } else {
        toast.error("Internal server error");
      }
    } finally {
      setOpenConfirm(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setPreview(URL.createObjectURL(file));
      form.setValue("companyLogoUrl", file);
    }
  };
  const existingLogo = form.watch("companyLogoUrl");

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Complete Your Profile</h1>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/rep/verify-password")}
        >
          Change Password
        </Button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <Input {...field} placeholder="Enter your name" />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <Input {...field} placeholder="Enter phone number" />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company Name */}
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <Input {...field} placeholder="Enter company name" />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company Logo */}
          <FormItem>
            <FormLabel>Company Logo</FormLabel>
            <div className="flex items-center gap-4">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-md border"
                />
              ) : existingLogo ? (
                <img
                  src={`${import.meta.env.VITE_API_IMG}${existingLogo}`}
                  alt="Company Logo"
                  className="h-20 w-20 object-cover rounded-md border"
                />
              ) : (
                <div className="h-20 w-20 bg-gray-200 flex items-center justify-center rounded-md border">
                  <span className="text-gray-500 text-sm">No Logo</span>
                </div>
              )}

              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="max-w-xs"
              />
            </div>
          </FormItem>

          {/* Employee ID */}
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee ID</FormLabel>
                <Input {...field} placeholder="Enter employee ID" />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Department Dropdown */}
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <select
                  {...field}
                  className="
            w-full 
            border 
            rounded-lg 
            px-3 
            py-2 
            appearance-none 
            bg-gray-50 
            hover:bg-gray-100 
            focus:bg-gray-100 
            focus:ring-2 
            focus:ring-gray-400 
            focus:border-gray-500 
            transition-all 
            duration-150
          "
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Territory Dropdown */}
          <FormField
            control={form.control}
            name="territories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Territories (Select multiple)</FormLabel>
                <div className="border rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
                  {territories.map((terr) => (
                    <div key={terr.id} className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        id={`territory-${terr.id}`}
                        value={terr.id}
                        checked={field.value?.includes(terr.id) || false}
                        onChange={(e) => {
                          const currentValues = field.value || [];
                          if (e.target.checked) {
                            field.onChange([...currentValues, terr.id]);
                          } else {
                            field.onChange(
                              currentValues.filter((id) => id !== terr.id)
                            );
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                      />
                      <label
                        htmlFor={`territory-${terr.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {terr.name}
                      </label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* About */}
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About</FormLabel>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Write about yourself"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <DynamicList
            name="educations"
            control={form.control}
            fields={[
              { label: "Degree", name: "degree" },
              { label: "Institute", name: "institute" },
              {
                label: "Year",
                name: "year",
                type: "number",
                placeholder: "YYYY",
              },
            ]}
          />

          <DynamicList
            name="certificates"
            control={form.control}
            fields={[
              { label: "Certificate", name: "name" },
              { label: "Issued By", name: "issuedBy" },
              {
                label: "Year",
                name: "year",
                type: "number",
                placeholder: "YYYY",
              },
            ]}
          />

          {/* Submit */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-gray-400 hover:bg-gray-600">
              Save
            </Button>
          </div>
        </form>
      </Form>

      <ConfirmDialog
        open={openConfirm}
        title="Confirm Save"
        message="Are you sure you want to save your profile?"
        onConfirm={confirmProfileUpdate}
        onCancel={() => setOpenConfirm(false)}
        confirmButtonClassName="bg-gray-400 text-white hover:bg-gray-600"
      />
    </div>
  );
}