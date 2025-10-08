import { Search, Plus } from "lucide-react";
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
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import { getPostList, getProfileRep } from "../api";
import useFetchList from "@/hooks/useFetchList";
import { useCallback } from "react";
import { ProductListDTO } from "../dto/productListDto";
import { MedicalRepDetailsDTO } from "../dto/MedicalRepDetailsDTO";

const RepDashboard = () => {
  const id = useSelector((state: any) => state.auth.user?.id);

  const fetchPosts = useCallback(() => {
    if (!id) return Promise.resolve([]);
    return getPostList(id);
  }, [id]);

  const fetchProfile = useCallback(async() => {
    if (!id) return Promise.resolve(null);
    const response=await getProfileRep(id);
    return response.data;
  }, [id]);

  const { data: postList, loading:postLoading, error:postError } = useFetchList(fetchPosts);
  const {
    data: rep,
    loading: profileLoading,
    error: profileError,
  } = useFetchList<MedicalRepDetailsDTO | null>(fetchProfile);


  if (postError || profileError) return <p>{postError || profileError}</p>;
  if (postLoading || profileLoading) return <p>Loading...</p>;

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
                <Input placeholder="Search posts..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {postList?.map((post: ProductListDTO) => (
                <PostCard
                  key={post.id}
                  {...post}
                  likes={119}
                  category="Cardiac"
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <ProfileCard rep={rep} />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default RepDashboard;
