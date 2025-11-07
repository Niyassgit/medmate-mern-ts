import { RepProfileData } from "../dto/RepFullDetailsDTO";
import { ProfileHeader } from "./ProfileHeader";
import { ProductPost } from "./ProductPost";

interface RepProfileProps {
  data: RepProfileData;
}

export const RepProfile = ({ data }: RepProfileProps) => {
  const { medicalRep, posts } = data;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <ProfileHeader rep={medicalRep} />

        {/* Products Section */}
        {posts.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-6 text-xl font-semibold text-foreground">Products I Represent</h2>
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
