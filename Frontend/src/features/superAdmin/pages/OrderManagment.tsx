
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { getAllOrders } from "../api/superAdminApi";
import { OrderTableDTO } from "../dto/OrderTableDTO";
import { format } from "date-fns";
import { Link } from "react-router-dom";

import { OrderStatus, PaymentStatus } from "../dto/OrderTableDTO";

export const getOrderStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    case OrderStatus.CONFIRMED:
      return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    case OrderStatus.SHIPPED:
      return "bg-indigo-100 text-indigo-700 hover:bg-indigo-100";
    case OrderStatus.DELIVERED:
      return "bg-green-100 text-green-700 hover:bg-green-100";
    case OrderStatus.CANCELLED:
      return "bg-red-100 text-red-700 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100";
  }
};

export const getPaymentStatusBadge = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.SUCCESS:
      return "bg-green-100 text-green-700 hover:bg-green-100";
    case PaymentStatus.FAILED:
      return "bg-red-100 text-red-700 hover:bg-red-100";
    case PaymentStatus.PENDING:
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100";
  }
};

const OrderManagment = () => {
  const [orders, setOrders] = useState<OrderTableDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrders(page, 10, startDate, endDate);
      if (response && response.data) {
        setOrders(response.data.orders);
        setTotalPages(Math.ceil(response.data.total / 10));
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, startDate, endDate]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Order Management</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all orders
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(1);
            }}
            className="border rounded px-3 py-2 text-sm w-[150px]"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(1);
            }}
            className="border rounded px-3 py-2 text-sm w-[150px]"
          />
        </div>
        {(startDate || endDate) && (
          <Button variant="outline" onClick={clearFilters} size="sm">
            Clear Filters
          </Button>
        )}
      </Card>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell className="font-mono text-xs">
                    {order.orderId.substring(0, 8)}...
                  </TableCell>
                  <TableCell>{order.doctorName || "Guest User"}</TableCell>
                  <TableCell>
                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>₹{order.totalAmount}</TableCell>
                  <TableCell>
                    <Badge className={getPaymentStatusBadge(order.payementStatus)}>
                      {order.payementStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getOrderStatusBadge(order.orderStatus)}>
                      {order.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/ admin / orders / ${order.orderId} `}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {orders.length > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OrderManagment;
