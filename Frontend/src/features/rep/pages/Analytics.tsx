import { CheckCircle, Clock } from "lucide-react";
import StatsCard from "@/components/shared/StatusCard";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AnalyticsDTO } from "../dto/AnalyticsDTO";
import {
  networkAnalytics,
  RepMutualConnections,
  RepPendingConnections,
} from "../api";
import toast from "react-hot-toast";
import ConnectionTable from "@/components/shared/ConnectionTable";
import ConnectionsModal, {
  ConnectionItem,
} from "@/components/shared/ConnectionsModal";

const Analytics = () => {
  const id = useSelector(
    (state: { auth: { user?: { id?: string } } }) => state.auth.user?.id
  );
  const [analytics, setAnalytics] = useState<AnalyticsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [fetcher, setFetcher] = useState<
    (() => Promise<ConnectionItem[]>) | null
  >(() => null);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (!id) return;
        const resp = await networkAnalytics(id);
        setAnalytics(resp.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load network analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [id]);

  const openModal = (
    title: string,
    fetchFn: () => Promise<ConnectionItem[]>
  ) => {
    setModalTitle(title);
    setFetcher(() => fetchFn);
    setIsOpen(true);
  };

  if (loading)
    return (
      <div className="p-10 text-center text-muted-foreground">Loading...</div>
    );

  if (!analytics)
    return (
      <div className="p-10 text-center text-muted-foreground">
        No data available
      </div>
    );

  const filteredDoctors = analytics.mutualConnections.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Network Overview
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 ">
          <StatsCard
            title="Mutual Connections"
            value={analytics?.mutualConnectionsCount?.toString() ?? "0"}
            description="Doctors you are connected with."
            icon={CheckCircle}
            iconColor="bg-cyan-100 text-primary"
            onClick={() =>
              openModal("Mutual Connections", () => RepMutualConnections(id!))
            }
          />
          <StatsCard
            title="Pending Requests"
            value={analytics?.pendingRequestCount?.toString() ?? "0"}
            description="Connection requests awaiting approval."
            icon={Clock}
            iconColor="bg-blue-100 text-primary"
            onClick={() =>
              openModal("Pending Cnnections", () => RepPendingConnections(id!))
            }
          />
        </div>
        {isOpen && fetcher && (
          <ConnectionsModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title={modalTitle}
            fetcher={fetcher}
            viewerRole="rep"
          />
        )}

        {/* Search Field + Table */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Connected Doctors
            </h2>

            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-sm px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <ConnectionTable data={filteredDoctors} type="doctor" />
        </div>
      </main>
    </div>
  );
};

export default Analytics;
