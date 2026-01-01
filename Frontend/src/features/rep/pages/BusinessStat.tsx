import { useState, useEffect } from "react";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  Calendar,
  FileSpreadsheet,
  BarChart3,
  Users,
  Activity,
} from "lucide-react";
import { getBusinessAnalytics, getAdvancedBusinessAnalytics, exportOrders } from "../api";
import { SpinnerButton } from "@/components/shared/SpinnerButton";
import { StatCard } from "../components/RepStatCard";
import { RepStatAnalyticsDTO } from "../dto/RepStatAnalyticsDTO";
import { AdvancedBusinessAnalyticsDTO } from "../dto/AdvancedBusinessAnalyticsDTO";
import OrderTable from "../components/OrderTable";
import toast from "react-hot-toast";
import { useFeature } from "@/hooks/useFeature";
import { Feature } from "@/types/SubscriptionStatus";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const BusinessStat = () => {
  const hasAdvancedAnalytics = useFeature(Feature.ADVANCED_BUSINESS_ANALYTICS);
  const [analyticsData, setAnalyticsData] =
    useState<RepStatAnalyticsDTO | null>(null);
  const [advancedAnalyticsData, setAdvancedAnalyticsData] =
    useState<AdvancedBusinessAnalyticsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getBusinessAnalytics(
          dateRange.startDate,
          dateRange.endDate
        );
        setAnalyticsData(data);
        
        // Fetch advanced analytics if user has the feature
        if (hasAdvancedAnalytics) {
          try {
            const advancedData = await getAdvancedBusinessAnalytics(
              dateRange.startDate,
              dateRange.endDate
            );
            setAdvancedAnalyticsData(advancedData);
          } catch (error: any) {
            console.error("Failed to fetch advanced analytics:", error);
            // Don't show error toast for advanced analytics, just log it
          }
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, hasAdvancedAnalytics]);

  const handleDateChange = (field: string, value: string) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const dawnloadExcel = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const blob = await exportOrders(dateRange.startDate, dateRange.endDate);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `orders_${dateRange.startDate}_${dateRange.endDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      toast.error("Failed to download report");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading && !analyticsData) return <SpinnerButton />;

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Business Analytics
          </h1>
          <p className="text-gray-600">
            Track your sales performance and top products
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-start justify-between gap-4">
          {/* Left: Date Range Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex-1">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Date Range:
                </span>
              </div>

              <div className="flex gap-4 flex-wrap">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      handleDateChange("startDate", e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 block mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      handleDateChange("endDate", e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Export Icon */}
          <div
            className={`bg-white rounded-lg shadow-md p-4 h-fit transition-all ${isDownloading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
            onClick={dawnloadExcel}
            title="Download Excel Report"
          >
            {isDownloading ? (
              <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FileSpreadsheet className="w-6 h-6 text-green-600 hover:scale-105 transition-transform" />
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={analyticsData?.totalRevenue || 0}
            color="bg-green-500"
          />
          <StatCard
            icon={TrendingUp}
            title="Monthly Revenue"
            value={analyticsData?.monthlyRevenue || 0}
            color="bg-blue-500"
          />
          <StatCard
            icon={ShoppingCart}
            title="Total Orders"
            value={analyticsData?.totalOrders || 0}
            color="bg-purple-500"
          />
          <StatCard
            icon={Package}
            title="Units Sold"
            value={analyticsData?.totalUnits || 0}
            color="bg-orange-500"
          />
        </div>

        {/* Advanced Analytics Charts - Only for subscribed users */}
        {hasAdvancedAnalytics && (
          <>
            {/* Growth Metrics Card */}
            {advancedAnalyticsData?.growthMetrics && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Growth Metrics</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Previous Period</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{advancedAnalyticsData.growthMetrics.previousPeriodRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Current Period</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{advancedAnalyticsData.growthMetrics.currentPeriodRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className={`bg-gradient-to-br rounded-lg p-4 ${
                    advancedAnalyticsData.growthMetrics.growthPercentage >= 0
                      ? "from-green-50 to-green-100"
                      : "from-red-50 to-red-100"
                  }`}>
                    <p className="text-sm text-gray-600 mb-1">Growth</p>
                    <p className={`text-2xl font-bold ${
                      advancedAnalyticsData.growthMetrics.growthPercentage >= 0
                        ? "text-green-700"
                        : "text-red-700"
                    }`}>
                      {advancedAnalyticsData.growthMetrics.growthPercentage >= 0 ? "+" : ""}
                      {advancedAnalyticsData.growthMetrics.growthPercentage.toFixed(2)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {advancedAnalyticsData.growthMetrics.growthAmount >= 0 ? "+" : ""}
                      ₹{Math.abs(advancedAnalyticsData.growthMetrics.growthAmount).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Revenue Timeline Chart */}
            {advancedAnalyticsData?.revenueTimeline && advancedAnalyticsData.revenueTimeline.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Revenue Timeline</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={advancedAnalyticsData.revenueTimeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
                    />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Revenue by Doctor */}
            {advancedAnalyticsData?.revenueByDoctor && advancedAnalyticsData.revenueByDoctor.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Revenue by Doctor</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hospital</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Orders</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {advancedAnalyticsData.revenueByDoctor.slice(0, 10).map((doctor) => (
                        <tr key={doctor.doctorId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{doctor.doctorName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{doctor.hospital || "N/A"}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                            ₹{doctor.revenue.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-gray-600">{doctor.orderCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Revenue by Status */}
            {advancedAnalyticsData?.revenueByStatus && advancedAnalyticsData.revenueByStatus.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue by Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={advancedAnalyticsData.revenueByStatus.map(item => ({
                          name: item.status,
                          value: item.revenue,
                          orderCount: item.orderCount
                        }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                      >
                        {advancedAnalyticsData.revenueByStatus.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number, name: string, props: { payload?: { orderCount?: number } }) => [
                          `₹${value.toLocaleString()}`, 
                          `${name} (${props.payload?.orderCount || 0} orders)`
                        ]} 
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {advancedAnalyticsData.revenueByStatus.map((status) => (
                      <div key={status.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">{status.status}</span>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            ₹{status.revenue.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">{status.orderCount} orders</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyticsData?.TopProducts?.length ? (
              analyticsData.TopProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-md"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://via.placeholder.com/150?text=Product";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                        #{index + 1} Best Seller
                      </span>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-3 mt-1">
                        {product.name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No top products found</p>
            )}
          </div>
        </div>

        {/* Average Order Value */}
        <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Average Order Value
              </h3>
              <p className="text-3xl font-bold">
                ₹
                {analyticsData && analyticsData.totalOrders > 0
                  ? (
                    analyticsData.totalRevenue / analyticsData.totalOrders
                  ).toFixed(2)
                  : "0.00"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Units per Order</p>
              <p className="text-2xl font-bold">
                {analyticsData && analyticsData.totalOrders > 0
                  ? (
                    analyticsData.totalUnits / analyticsData.totalOrders
                  ).toFixed(1)
                  : "0.0"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[70%] mx-auto">
        <OrderTable orders={analyticsData?.ordersList} loading={loading} />
      </div>
    </div>
  );
};

export default BusinessStat;
