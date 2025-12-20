import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  Calendar,
  FileSpreadsheet,
} from "lucide-react";
import { getBusinessAnalytics, exportOrders } from "../api";
import { SpinnerButton } from "@/components/shared/SpinnerButton";
import { StatCard } from "../components/RepStatCard";
import { RepStatAnalyticsDTO } from "../dto/RepStatAnalyticsDTO";
import OrderTable from "../components/OrderTable";
import toast from "react-hot-toast";

const BusinessStat = () => {
  const [analyticsData, setAnalyticsData] =
    useState<RepStatAnalyticsDTO | null>(null);
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
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

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
