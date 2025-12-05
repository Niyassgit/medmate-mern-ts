import { useState } from "react";
import {
  Users,
  UserCheck,
  Clock,
  CreditCard,
  DollarSign,
  AlertTriangle,
  FileText,
  Link2,
} from "lucide-react";
import { StatsCard } from "../components/StatsCard";
import { UserDistributionChart } from "../components/UserDistributionChart";
import { UserGrowthChart } from "../components/UserGrowthChart";
import { RevenueByTierChart } from "../components/RevenueByTierChart";
import { RecentSubscriptionsTable } from "../components/RecentSubscriptionsTable";
import { DashboardFilters, FilterValues } from "../components/DashboardFilters";
import {
  useStatsSummary,
  useUserDistribution,
  useUserGrowth,
  useRevenueByTier,
  useRecentSubscriptions,
} from "../hooks/useAdminDashboard";

const AdminDashboard = () => {
  const [filters, setFilters] = useState<FilterValues>({
    year: new Date().getFullYear().toString(),
  });

  const { data: stats, isLoading: statsLoading } = useStatsSummary(
    filters.startDate,
    filters.endDate
  );
  const { data: distribution, isLoading: distributionLoading } =
    useUserDistribution(filters.startDate, filters.endDate);
  const { data: growth, isLoading: growthLoading } = useUserGrowth(
    filters.year
  );
  const { data: revenue, isLoading: revenueLoading } = useRevenueByTier(
    filters.startDate,
    filters.endDate
  );
  const { data: subscriptions, isLoading: subscriptionsLoading } =
    useRecentSubscriptions(10);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Overview of your platform metrics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <DashboardFilters onFilterChange={handleFilterChange} />

        {/* Stats Cards Grid */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Key Metrics
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="animate-fade-in" style={{ animationDelay: "0ms" }}>
              <StatsCard
                title="Total Doctors"
                value={
                  statsLoading ? "..." : formatNumber(stats?.totalDoctors || 0)
                }
                icon={UserCheck}
                variant="primary"
                trend={{ value: 12, isPositive: true }}
              />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "50ms" }}>
              <StatsCard
                title="Total Reps"
                value={
                  statsLoading ? "..." : formatNumber(stats?.totalReps || 0)
                }
                icon={Users}
                variant="info"
                trend={{ value: 8, isPositive: true }}
              />
            </div>
            <div
              className="animate-fade-in"
              style={{ animationDelay: "100ms" }}
            >
              <StatsCard
                title="Monthly Revenue"
                value={
                  statsLoading
                    ? "..."
                    : formatCurrency(stats?.monthlyRevenue || 0)
                }
                icon={DollarSign}
                variant="success"
                trend={{ value: 15, isPositive: true }}
              />
            </div>
            <div
              className="animate-fade-in"
              style={{ animationDelay: "150ms" }}
            >
              <StatsCard
                title="Active Subscriptions"
                value={
                  statsLoading
                    ? "..."
                    : formatNumber(stats?.activeSubscriptions || 0)
                }
                icon={CreditCard}
                variant="primary"
              />
            </div>
            <div
              className="animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              <StatsCard
                title="Pending Validations"
                value={
                  statsLoading
                    ? "..."
                    : formatNumber(stats?.pendingValidations || 0)
                }
                icon={Clock}
                variant="warning"
              />
            </div>
            <div
              className="animate-fade-in"
              style={{ animationDelay: "250ms" }}
            >
              <StatsCard
                title="Expiring Plans"
                value={
                  statsLoading ? "..." : formatNumber(stats?.expiringPlans || 0)
                }
                icon={AlertTriangle}
                variant="warning"
              />
            </div>
            <div
              className="animate-fade-in"
              style={{ animationDelay: "300ms" }}
            >
              <StatsCard
                title="Total Posts"
                value={
                  statsLoading ? "..." : formatNumber(stats?.totalPosts || 0)
                }
                icon={FileText}
                variant="default"
              />
            </div>
            <div
              className="animate-fade-in"
              style={{ animationDelay: "350ms" }}
            >
              <StatsCard
                title="Total Connections"
                value={
                  statsLoading
                    ? "..."
                    : formatNumber(stats?.totalConnections || 0)
                }
                icon={Link2}
                variant="info"
              />
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Analytics
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div
              className="animate-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              <UserGrowthChart
                data={growth || null}
                isLoading={growthLoading}
              />
            </div>
            <div className="grid gap-6">
              <div
                className="animate-fade-in"
                style={{ animationDelay: "450ms" }}
              >
                <UserDistributionChart
                  data={distribution || null}
                  isLoading={distributionLoading}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Revenue Chart */}
        <section className="mb-8">
          <div className="flex justify-center">
            <div
              className="animate-fade-in w-full max-w-3xl"
              style={{ animationDelay: "500ms" }}
            >
              <RevenueByTierChart
                data={revenue || null}
                isLoading={revenueLoading}
              />
            </div>
          </div>
        </section>

        {/* Recent Subscriptions Table */}
        <section
          className="animate-fade-in"
          style={{ animationDelay: "600ms" }}
        >
          <RecentSubscriptionsTable
            data={subscriptions || null}
            isLoading={subscriptionsLoading}
          />
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
