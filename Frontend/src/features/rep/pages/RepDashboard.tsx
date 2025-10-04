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

import post1 from "@/assets/post-1.jpg";
import post2 from "@/assets/post-2.jpg";
import post3 from "@/assets/post-3.jpg";
import post4 from "@/assets/post-4.jpg";
import post5 from "@/assets/post-5.jpg";

const posts = [
  {
    id: 1,
    image: post1,
    category: "Product Launch",
    title: "New Advancements in ACE Inhibitors",
    date: "November 18, 2024",
    description: "A comprehensive overview of the latest breakthrough in ACE Inhibitor technology for improved treatment and management of cardiovascular conditions.",
    likes: 245
  },
  {
    id: 2,
    image: post2,
    category: "Education",
    title: "Understanding Diabetes: Basics and Beyond",
    date: "November 10, 2024",
    description: "Exploring the fundamentals of action and cellular dynamics of our leading \"Beta-2 Agonist medication.",
    likes: 834
  },
  {
    id: 3,
    image: post3,
    category: "Clinical Data",
    title: "Q3 2024: Sales Performance Increase",
    date: "October 22, 2024",
    description: "Highlighting a significant increase in the quarterly financial results and the achievement across all divisions. See our product line report.",
    likes: 856
  },
  {
    id: 4,
    image: post4,
    category: "Product Launch",
    title: "Draft: Upcoming Product Launch Strategy",
    date: "October 15, 2024",
    description: "Preliminary plans for the Q4 2024 product launch event. Pre-plans outline launch activities, target audiences, messaging, and critical milestones.",
    likes: 743
  },
  {
    id: 5,
    image: post5,
    category: "Education",
    title: "Webinar: Patient-Centric Care in Geriatric Diseases",
    date: "September 30, 2024",
    description: "Highlights from recent expert webinar on patient-centric approaches to chronic medication regimens for chronic diseases in elderly.",
    likes: 456
  }
];

const RepDashboard = () => {


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
              {posts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <ProfileCard />
          </aside>
        </div>
      </main>

    </div>
  );
};

export default  RepDashboard;
