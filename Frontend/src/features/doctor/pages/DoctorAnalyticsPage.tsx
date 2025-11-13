import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Users,Clock, UserPlus, Search } from "lucide-react";

import StatsCard from "@/components/shared/StatusCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import { doctorAnltyics } from "../api";
import { DoctorAnalyticsDTO } from "../dto/DoctorAnalyticsDTO";
import { RepListOnDoctorAnalyticsDTO } from "../dto/RepListOnDocAnlyticsDTO";
import ConnectionTable from "@/components/shared/ConnectionTable";
import { SpinnerButton } from "@/components/shared/SpinnerButton";

const DoctorAnalyticsPage = () => {
  const id = useSelector((state: any) => state.auth.user?.id);
  const [analytics, setAnalytics] = useState<DoctorAnalyticsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (!id) return;
        const resp = await doctorAnltyics(id);
        setAnalytics(resp.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [id]);

  const filteredReps = useMemo(() => {
    if (!analytics?.mutualConnections) return [];

    return analytics.mutualConnections.filter(
      (rep: RepListOnDoctorAnalyticsDTO) => {
        const matchesSearch =
          rep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rep.company.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
      }
    );
  }, [analytics, searchTerm]);

  if (loading) {
    return (
     <SpinnerButton />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">  
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Connected Representatives
          </h1>
          <p className="text-muted-foreground">
            Manage your medical and pharmaceutical representative network.
          </p>
        </div>

        {/* Stats Overview */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Representative Overview
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            A summary of your connected and pending representatives.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <StatsCard
              icon={Users}
              title="Total Reps"
              value={String(analytics?.mutualConnectionsCount ?? 0)}
              description="Total connected representatives"
              iconColor="bg-blue-100 text-blue-600"
            />
            <StatsCard
              icon={Clock}
              title="Pending Connections"
              value={String(analytics?.pendingRequestCount ?? 0)}
              description="Awaiting approval"
              iconColor="bg-yellow-100 text-yellow-600"
            />

            <div className="flex items-center justify-center">
              <Button className="w-full bg-secondary hover:bg-secondary/90">
                <UserPlus className="w-4 h-4 mr-2" />
                Connect New Rep
              </Button>
            </div>
          </div>
        </Card>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or company..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <ConnectionTable data={filteredReps} type="rep" />
        </Card>
      </main>
    </div>
  );
};

export default DoctorAnalyticsPage;
