import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getOrderDetails, updateOrderStatus } from "../api/superAdminApi";
import { IOrderDetailsDTO } from "../dto/OrderDetailsDTO";
import { OrderStatus, PaymentStatus } from "../dto/OrderTableDTO";
import { getOrderStatusBadge, getPaymentStatusBadge } from "./OrderManagment";
import { format } from "date-fns";
import { ArrowLeft, MapPin, Package, User } from "lucide-react";
import toast from "react-hot-toast";

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<IOrderDetailsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStratus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id: string) => {
    setLoading(true);
    try {
      const response = await getOrderDetails(id);
      if (response && response.data) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch order details", error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!orderId) return;
    setUpdatingStatus(true);
    try {
      const response = await updateOrderStatus(orderId, newStatus);
      if (response && response.success) {
        toast.success("Order status updated successfully");
        fetchOrderDetails(orderId);
      }
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading order details...</div>;
  }

  if (!order) {
    return <div className="p-8 text-center">Order not found</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/admin/orders")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            Order #{order.orderId ? order.orderId.slice(-6).toUpperCase() : ""}
            <Badge className={getOrderStatusBadge(order.status)}>
              {order.status}
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1">
            Placed on {format(new Date(order.createdAt), "PPP p")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Update Status:</span>
          <Select
            value={order.status}
            onValueChange={(val) => handleStatusUpdate(val as OrderStatus)}
            disabled={updatingStratus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={OrderStatus.CONFIRMED}>Confirmed</SelectItem>
              <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
              <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
              <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" /> Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.prescription?.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <h4 className="font-semibold">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Brand: {item.product.brand}
                      </p>
                      <p className="text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{item.product.mrp}</p>
                      <p className="text-sm text-muted-foreground">
                        Total: ₹{item.product.mrp * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t flex justify-between items-center font-bold text-lg">
                  <span>Total Amount</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    className={`mt-1 ${getPaymentStatusBadge(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment ID</p>
                  <p className="font-mono text-sm">
                    {order.paymentId || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customer & Address */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p>{order.guest?.name || "Guest User"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p>{order.guest?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p>{order.guest?.phone || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.address ? (
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.address.fullName}</p>
                  <p>{order.address.street}</p>
                  <p>
                    {order.address.city}, {order.address.state}
                  </p>
                  <p>{order.address.zipCode}</p>
                  <p className="mt-2 text-muted-foreground">
                    Phone: {order.address.phone}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No address details available
                </p>
              )}
            </CardContent>
          </Card>

          {order.prescription?.doctor && (
            <Card>
              <CardHeader>
                <CardTitle>Prescribed By</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Doctor Name</p>
                  <p>{order.prescription.doctor.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Hospital</p>
                  <p>{order.prescription.doctor.hospital}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
