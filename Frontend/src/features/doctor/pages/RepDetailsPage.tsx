import { RepProfileData, MedicalRep } from "../dto/RepFullDetailsDTO";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProductPost } from "../components/ProductPost";
import { repProfileDetails } from "../api";
import useFetchItem from "@/hooks/useFetchItem";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { SpinnerButton } from "@/components/shared/SpinnerButton";
import { ArrowLeft } from "lucide-react";

export const RepDetailsPage = () => {
  const { repId } = useParams<{ repId: string }>();
  const navigate = useNavigate();
  const fetchRepDetails = useCallback(async (): Promise<RepProfileData> => {
    try {
      if (!repId) throw new Error("No repId found");
      const res = await repProfileDetails(repId);
      return res.data as RepProfileData;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch representative details";
      toast.error(errorMessage);
      return { medicalRep: {} as MedicalRep, posts: [] };
    }
  }, [repId]);

  const { data, error, loading } =
    useFetchItem<RepProfileData>(fetchRepDetails);

  if (loading) return <SpinnerButton />;
  if (error || !data)
    return (
      <p className="text-center text-red-500 py-10">Failed to load data</p>
    );

  const { medicalRep, posts } = data;
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 p-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        {/* Profile Header */}
        <ProfileHeader rep={medicalRep} />
        {/* Products Section */}
        {posts.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-6 text-xl font-semibold text-foreground">
              Products I Represent
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <ProductPost key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}
        {/* Empty State */}
        {posts.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">No products available</p>
          </div>
        )}
      </div>
    </div>
  );
};
