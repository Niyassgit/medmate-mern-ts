import {
  IndianRupee,
  Clock,
  CheckCircle,
  ShoppingCart,
  Package,
  Calendar,
  ClipboardList,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import StatsCard from "@/components/shared/StatusCard";
import useFetchItem from "@/hooks/useFetchItem";
import { useCallback, useState, useEffect, useRef } from "react";
import { doctorCommissions } from "../api";
import { DoctorCommissionDashboardDTO } from "../dto/DoctorCommissionDashboardDTO";
import { DoctorCommissionItemDTO } from "../dto/DoctorCommissionItemDTO";
import { Spinner } from "@/components/ui/spinner";

const CommissionCatalogue = () => {
  const [filter, setFilter] = useState<"weekly" | "monthly" | "yearly" | "custom">("monthly");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [localCommissions, setLocalCommissions] = useState<DoctorCommissionItemDTO[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const getDateRange = useCallback(() => {
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    if (filter === "custom") {
      if (customStartDate && customEndDate) {
        startDate = new Date(customStartDate);
        endDate = new Date(customEndDate);
      } else {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
      }
    } else if (filter === "weekly") {
      startDate.setDate(now.getDate() - 6);
      endDate = now;
    } else if (filter === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = now;
    } else if (filter === "yearly") {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = now;
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  }, [filter, customStartDate, customEndDate]);

  const fetchCommissions = useCallback(() => {
    const { startDate, endDate } = getDateRange();
    return doctorCommissions(startDate, endDate, filter);
  }, [getDateRange, filter]);

  const { data, error, loading } =
    useFetchItem<DoctorCommissionDashboardDTO>(fetchCommissions);

  useEffect(() => {
    if (data) {
      setLocalCommissions(data.commissions || []);
      setNextCursor(data.nextCursor || null);
      setHasMore(data.hasMore || false);
    }
  }, [data]);

  const loadMoreCommissions = useCallback(async () => {
    if (!hasMore || loadingMore || !nextCursor) return;

    setLoadingMore(true);
    try {
      const { startDate, endDate } = getDateRange();
      const moreData = await doctorCommissions(startDate, endDate, filter, nextCursor);

      if (moreData.commissions) {
        setLocalCommissions((prev) => [...prev, ...moreData.commissions]);
        setNextCursor(moreData.nextCursor || null);
        setHasMore(moreData.hasMore || false);
      }
    } catch (err) {
      console.error("Failed to load more commissions", err);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, nextCursor, filter, getDateRange]);

  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 200 && hasMore && !loadingMore) {
        loadMoreCommissions();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingMore, loadMoreCommissions]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner className="w-10 h-10 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20 text-red-500">
        Error loading commissions: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center py-20 text-muted-foreground">
        No data available
      </div>
    );
  }

  const { summary, timeline } = data;

  return (
    <div className="space-y-8  bg-amber-50 p-5">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 ">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Earnings</h1>
          <p className="text-sm text-muted-foreground">
            Track your commission income from prescriptions
          </p>
        </div>

        {/* Filter Buttons and Custom Date Picker */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            {(["weekly", "monthly", "yearly", "custom"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === f
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
                  }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Custom Date Range Picker */}
          {filter === "custom" && (
            <div className="flex items-center gap-3 bg-white border rounded-lg p-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  max={customEndDate || undefined}
                  className="px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Start Date"
                />
                <span className="text-gray-400">→</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  min={customStartDate || undefined}
                  className="px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="End Date"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Earnings"
          value={`₹${summary.totalEarnings.toFixed(2)}`}
          description="Overall commission earned"
          icon={IndianRupee}
          iconColor="bg-green-100 text-green-600"
        />

        {/* <StatsCard
          title="Settled"
          value={`₹${summary.settledEarnings.toFixed(2)}`}
          description="Credited amount"
          icon={CheckCircle}
          iconColor="bg-emerald-100 text-emerald-600"
        /> */}

        {/* <StatsCard
          title="Pending"
          value={`₹${summary.pendingEarnings.toFixed(2)}`}
          description="Yet to be settled"
          icon={Clock}
          iconColor="bg-yellow-100 text-yellow-600"
        /> */}

        <StatsCard
          title="Total Prescriptions"
          value={summary.totalPrescriptions.toString()}
          description="Total prescriptions issued"
          icon={ClipboardList}
          iconColor="bg-orange-100 text-orange-600"
        />

        <StatsCard
          title="Orders"
          value={summary.totalOrders.toString()}
          description="Orders generating revenue"
          icon={ShoppingCart}
          iconColor="bg-blue-100 text-blue-600"
        />

        <StatsCard
          title="Products"
          value={summary.totalProducts.toString()}
          description="Prescribed products"
          icon={Package}
          iconColor="bg-purple-100 text-purple-600"
        />
      </div>

      {/* ================= CHART ================= */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Earnings Over Time</h2>

        {timeline.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No data available for the selected period
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={timeline}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: filter === "yearly" ? 40 : filter === "monthly" ? 50 : 60
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="period"
                  angle={filter === "yearly" ? 0 : filter === "monthly" ? -15 : -45}
                  textAnchor={filter === "yearly" ? "middle" : "end"}
                  height={filter === "yearly" ? 40 : filter === "monthly" ? 50 : 80}
                  interval={filter === "yearly" ? 0 : "preserveStartEnd"}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => `₹${value.toFixed(0)}`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number) => [`₹${value.toFixed(2)}`, "Earnings"]}
                  labelStyle={{ color: "#374151" }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="earnings"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ================= COMMISSION TABLE ================= */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Commission Details</h2>
        </div>

        {localCommissions.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            No commission data available for this period
          </div>
        ) : (
          <div
            ref={tableContainerRef}
            className="overflow-x-auto max-h-[600px] overflow-y-auto"
          >
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Order ID</th>
                  <th className="px-6 py-3 text-left">Product</th>
                  <th className="px-6 py-3 text-right">MRP</th>
                  <th className="px-6 py-3 text-right">Earning</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {localCommissions.map((c) => (
                  <tr
                    key={c.commissionId}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {new Date(c.earnedAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {c.orderId.slice(-8)}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">
                      {c.productName}
                    </td>
                    <td className="px-6 py-4 text-right">
                      ₹{c.mrp.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-green-600">
                      ₹{c.doctorEarning.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === "SETTLED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loadingMore && (
              <div className="flex justify-center items-center py-4">
                <Spinner className="w-6 h-6 text-primary" />
              </div>
            )}
            {!hasMore && localCommissions.length > 0 && (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No more commissions to load
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionCatalogue;
