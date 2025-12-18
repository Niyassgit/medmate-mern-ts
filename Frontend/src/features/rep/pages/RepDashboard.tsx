import { Search, Plus, Archive, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PostCard from "../components/PostCard";
import ProfileCard from "../components/ProfileCard";
import { ConnectionLimitBadge } from "../components/ConnectionLimitBadge";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import { getPostList, getProfileRep, getConnectionRequestStats } from "../api";
import useFetchList from "@/hooks/useFetchItem";
import { useCallback, useEffect, useState } from "react";
import { ProductListDTO } from "../dto/productListDto";
import { MedicalRepDetailsDTO } from "../dto/MedicalRepDetailsDTO";
import toast from "react-hot-toast";
import { SpinnerButton } from "@/components/shared/SpinnerButton";
import { ProductPostListStatus } from "@/types/ProductListStatus";

const RepDashboard = () => {
  const id = useSelector((state: any) => state.auth.user?.id);
  const [posts, setPosts] = useState<ProductListDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductPostListStatus>(
    ProductPostListStatus.ALL
  );

  const fetchPosts = useCallback(() => {
    if (!id) return Promise.resolve([]);
    return getPostList(id, statusFilter);
  }, [id, statusFilter]);

  const fetchProfile = useCallback(async () => {
    if (!id) return Promise.resolve(null);
    const response = await getProfileRep(id);
    return response.data;
  }, [id]);

  const fetchConnectionStats = useCallback(async () => {
    try {
      return await getConnectionRequestStats();
    } catch (error) {
      console.error("Failed to fetch connection stats:", error);
      return null;
    }
  }, []);

  const {
    data: fetchedPost,
    loading: postLoading,
    error: postError,
  } = useFetchList(fetchPosts);
  useEffect(() => {
    setPosts(fetchedPost || []);
  }, [fetchedPost]);

  const {
    data: rep,
    loading: profileLoading,
    error: profileError,
  } = useFetchList<MedicalRepDetailsDTO | null>(fetchProfile);

  const { data: connectionStats, loading: statsLoading } =
    useFetchList<any>(fetchConnectionStats);

  const refreshSingnedUrls = async () => {
    try {
      const updatePosts = await fetchPosts();
      setPosts(updatePosts);
    } catch (error) {
      toast.error("Failed to refresh signed URLs");
    }
  };
  const handleArchived = (postId: string) => {
    setTimeout(() => {
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    }, 700);
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (postError || profileError) return <p>{postError || profileError}</p>;
  if (postLoading || profileLoading) return <SpinnerButton />;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="container mx-auto flex-1 px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main content */}
          <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-3xl font-bold text-foreground">My Posts</h1>
              <Link to="/rep/dashboard/add-post">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload New Post
                </Button>
              </Link>
            </div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as ProductPostListStatus)
                }
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ProductPostListStatus.ALL}>All</SelectItem>
                  <SelectItem value={ProductPostListStatus.PUBLISHED}>
                    Published
                  </SelectItem>
                  <SelectItem value={ProductPostListStatus.ARCHIVE}>
                    Archived
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    {...post}
                    likes={119}
                    category={rep?.departmentName ?? ""}
                    onImageError={refreshSingnedUrls}
                    onArchived={handleArchived}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center border rounded-2xl p-12 text-center shadow-sm bg-muted/10 min-h-[300px]">
                  {searchQuery ? (
                    <>
                      <div className="bg-muted p-4 rounded-full mb-4">
                        <Search className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No matches found
                      </h3>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        We couldn't find any posts matching "{searchQuery}". Try adjusting your search terms.
                      </p>
                    </>
                  ) : statusFilter === ProductPostListStatus.ARCHIVE ? (
                    <>
                      <div className="bg-orange-100 p-4 rounded-full mb-4">
                        <Archive className="h-8 w-8 text-orange-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No archived products
                      </h3>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        You haven't archived any products yet. Archived products will appear here.
                      </p>
                    </>
                  ) : statusFilter === ProductPostListStatus.PUBLISHED ? (
                    <>
                      <div className="bg-green-100 p-4 rounded-full mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No published products
                      </h3>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        You don't have any active products visible to the public.
                      </p>
                      <Link to="/rep/dashboard/add-post" className="mt-6">
                        <Button className="bg-primary hover:bg-primary/90">
                          <Plus className="mr-2 h-4 w-4" /> Add Product
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <Plus className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No Products Yet
                      </h3>
                      <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                        You haven’t uploaded any products yet. Start by adding one
                        now to reach more doctors!
                      </p>
                      <Link to="/rep/dashboard/add-post">
                        <Button className="bg-primary hover:bg-primary/90">
                          <Plus className="mr-2 h-4 w-4" /> Add Product
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:sticky lg:top-8 lg:self-start lg:block">
            <div className="space-y-4">
              {/* Connection Limit Badge */}
              {connectionStats && (
                <ConnectionLimitBadge
                  used={connectionStats.used || 0}
                  limit={connectionStats.limit}
                  isSubscribed={connectionStats.isSubscribed || false}
                />
              )}
              <ProfileCard rep={rep} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default RepDashboard;
