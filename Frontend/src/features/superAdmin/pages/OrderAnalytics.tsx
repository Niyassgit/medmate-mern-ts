import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  CheckCircle,
  XCircle,
  IndianRupee,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

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

import StatsCard from "@/components/shared/StatusCard";
import { Card } from "@/components/ui/card";
import { orderAnalytics } from "../api/superAdminApi";
import { getCurrentMonthRange } from "@/lib/utils";
import { OrderAnalyticsResponse } from "../dto/OrderAnalyticsResponse";

const COLORS = ["#8B5CF6", "#EC4899", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

const getStatusColor = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "SHIPPED":
      return "bg-blue-100 text-blue-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const OrderAnalyticsPage = () => {
  const navigate = useNavigate();
  const { startDate: defaultStart, endDate: defaultEnd } =
    getCurrentMonthRange();
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [data, setData] = useState<OrderAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await orderAnalytics(startDate, endDate);
      setData(res);
    } catch (err) {
      console.error("Failed to load order analytics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading && !data) {
    return <div className="p-6">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="p-6">No data available</div>;
  }

  const { summary, charts } = data;

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold">Order Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Monthly overview by default. Adjust date range as needed.
        </p>
      </div>

      {/* ================= DATE FILTER ================= */}
      <Card className="p-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-xs text-muted-foreground">Start Date</label>
          <input
            type="date"
            value={startDate}
            max={endDate || today}
            onChange={(e) => {
              if (e.target.value > today) {
                toast.error("Cannot select future dates");
                return;
              }
              setStartDate(e.target.value);
            }}
            className="border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground">End Date</label>
          <input
            type="date"
            value={endDate}
            max={today}
            onChange={(e) => {
              if (e.target.value > today) {
                toast.error("Cannot select future dates");
                return;
              }
              setEndDate(e.target.value);
            }}
            className="border rounded px-3 py-2 text-sm"
          />
        </div>

        <button
          onClick={fetchAnalytics}
          className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700"
        >
          Apply
        </button>
      </Card>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Prescriptions"
          value={summary.totalPrescriptions.toString()}
          description="Prescriptions created"
          icon={FileText}
          iconColor="bg-blue-100 text-blue-700"
        />

        <StatsCard
          title="Paid Orders"
          value={summary.paidOrders.toString()}
          description="Successful payments"
          icon={CheckCircle}
          iconColor="bg-green-100 text-green-700"
        />

        <StatsCard
          title="Unpaid Prescriptions"
          value={charts.paidVsUnpaid.unpaid.toString()}
          description="Not converted to paid orders"
          icon={XCircle}
          iconColor="bg-red-100 text-red-700"
        />

        <StatsCard
          title="Gross Amount"
          value={`₹${summary.grossAmount.toLocaleString()}`}
          description="Total order value"
          icon={IndianRupee}
          iconColor="bg-purple-100 text-purple-700"
        />

        <StatsCard
          title="Doctor Earnings"
          value={`₹${summary.doctorEarnings.toFixed(2)}`}
          description="Gross payout"
          icon={Stethoscope}
          iconColor="bg-emerald-100 text-emerald-700"
          onClick={() =>
            navigate(
              `/admin/order-analytics/doctor-earnings?startDate=${startDate}&endDate=${endDate}`
            )
          }
        />

        <StatsCard
          title="Admin Earnings"
          value={`₹${summary.adminEarnings.toFixed(2)}`}
          description="Platform commission"
          icon={ShieldCheck}
          iconColor="bg-orange-100 text-orange-700"
          onClick={() =>
            navigate(
              `/admin/order-analytics/admin-earnings?startDate=${startDate}&endDate=${endDate}`
            )
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Revenue Over Time</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Revenue grouped by selected period
          </p>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.revenueOverTime} barCategoryGap={24}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value: number) => [`₹${value}`, "Revenue"]}
                />
                <Bar dataKey="amount" fill="#8884d8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Sales per Company</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Distribution of sales by medical company
          </p>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.salesByCompany}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.salesByCompany.map((_, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 overflow-hidden">
          <h2 className="text-lg font-semibold mb-4">Recent 10 Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.recentOrders.map((order: any) => (
                  <tr
                    key={order.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                  >
                    <td className="px-4 py-3 font-medium">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-3">{order.guest?.name || "N/A"}</td>
                    <td className="px-4 py-3">{order.prescription?.doctor?.name || "N/A"}</td>
                    <td className="px-4 py-3">₹{order.totalAmount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Top 5 Doctors</h2>
          <div className="space-y-4">
            {charts.topDoctors.map((doc: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{doc.name}</span>
                </div>
                <span className="text-sm font-bold">₹{doc.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderAnalyticsPage;
