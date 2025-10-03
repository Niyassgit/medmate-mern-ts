import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import {
  CompleteDoctorProfileSchema,
  CompleteDoctorProfileDTO,
} from "../schemas/CompleteDoctorProfileSchema";
import { completeProfile, getProfileDoctor } from "../api";
import { useEffect, useState } from "react";

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
import { DynamicList } from "./DynamicList";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

export default function CompleteProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [formData, setFormData] = useState<CompleteDoctorProfileDTO | null>(
    null
  );

  const form = useForm<CompleteDoctorProfileDTO>({
    resolver: zodResolver(CompleteDoctorProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
      profileImage: null,
      hospital: "",
      registrationId: "",
      licenseImageUrl: null,
      about: "",
      opHours: "",
      educations: [{ degree: "", institute: "", year: null }],
      certificates: [{ name: "", issuedBy: "", year: null }],
    },
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await getProfileDoctor(id!);
        const data = response.data;
        if (data) {
          form.reset({
            name: data.name ?? "",
            phone: data.phone ?? "",
            profileImage: data.profileImage ?? null,
            hospital: data.hospital ?? "",
            registrationId: data.registrationId ?? "",
            about: data.about ?? "",
            opHours: data.opHours ?? "",
            educations:
              data.educations.length > 0
                ? data.educations
                : [{ degree: "", institute: "", year: null }],
            certificates:
              data.certificates.length > 0
                ? data.certificates
                : [{ name: "", issuedBy: "", year: null }],
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfile();
  }, [id, form]);

  const confirmProfileUpdate = async () => {
    if (!formData) return;
    try {
      await completeProfile(id!, formData);
      toast.success("Profile saved successfully");
      navigate("/doctor/profile");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile");
    } finally {
      setOpenConfirm(false);
    }
  };

  const handleFormSubmit = (values: CompleteDoctorProfileDTO) => {
    setFormData(values);
    setOpenConfirm(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>

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

          {/* Hospital */}
          <FormField
            control={form.control}
            name="hospital"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hospital</FormLabel>
                <Input {...field} placeholder="Enter hospital name" />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Registration ID */}
          <FormField
            control={form.control}
            name="registrationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration ID</FormLabel>
                <Input {...field} placeholder="Enter registration ID" />
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

          {/* OP Hours */}
          <FormField
            control={form.control}
            name="opHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OP Hours</FormLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="e.g. 9am - 5pm"
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
            <Button type="submit" className="bg-[#E8618C] hover:bg-[#e62a66]">
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
      />
    </div>
  );
}
