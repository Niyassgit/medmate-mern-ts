import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Package, User, CreditCard, MapPin, Building2, Stethoscope, Mail, Phone } from 'lucide-react';
import { getOrderDetails } from '../api';
import { OrderStatus, PaymentStatus } from '@/types/PaymentTypes';
import { SpinnerButton } from '@/components/shared/SpinnerButton';

interface OrderDetail {
    id: string;
    createdAt: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    totalAmount: number;
    paymentId: string;
    guest: {
        name: string;
        email: string;
        phone: string;
    };
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    prescription: {
        id: string;
        createdAt: string;
        doctor: {
            name: string;
            specialization: string;
            hospital?: string;
        };
    };
    items: {
        name: string;
        quantity: number;
        image?: string;
    }[];
}

export default function OrderDetailPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;
            try {
                setLoading(true);
                const data = await getOrderDetails(orderId);
                setOrder(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case OrderStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
            case OrderStatus.CONFIRMED: return 'bg-blue-100 text-blue-800';
            case OrderStatus.SHIPPED: return 'bg-indigo-100 text-indigo-800';
            case OrderStatus.DELIVERED: return 'bg-green-100 text-green-800';
            case OrderStatus.CANCELLED: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case PaymentStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
            case PaymentStatus.SUCCESS: return 'bg-green-100 text-green-800';
            case PaymentStatus.FAILED: return 'bg-red-100 text-red-800';
            case PaymentStatus.REFUNDED: return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };


    if (loading) return <SpinnerButton />;
    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="text-red-500 text-xl font-semibold mb-2">Error</div>
                <p className="text-gray-600 mb-4">{error}</p>
                <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Go Back</button>
            </div>
        </div>
    );
    if (!order) return <div className="text-center p-10">Order not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                            <span className="text-sm text-gray-500 font-mono">#{order.id.slice(-8).toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar className="w-4 h-4" />
                            <span>Placed on {formatDate(order.createdAt)}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Items Card */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-gray-500" />
                                    Ordered Items
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-6">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.image || '/placeholder.png'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://placehold.co/80x80?text=Rx';
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                                <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                                            </div>
                                            {/* Price could go here if item price is available */}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Prescription & Doctor Card */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Stethoscope className="w-5 h-5 text-gray-500" />
                                    Prescription Details
                                </h2>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Prescription ID</label>
                                    <p className="mt-1 font-mono text-gray-900">{order.prescription.id.slice(-8).toUpperCase()}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</label>
                                    <p className="mt-1 text-gray-900">{formatDate(order.prescription.createdAt)}</p>
                                </div>
                                <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-50 rounded-full">
                                            <User className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Dr. {order.prescription.doctor.name}</p>
                                            <p className="text-sm text-gray-600">{order.prescription.doctor.specialization}</p>
                                            {order.prescription.doctor.hospital && (
                                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                    <Building2 className="w-3 h-3" />
                                                    {order.prescription.doctor.hospital}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">

                        {/* Payment Summary */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-gray-500" />
                                    Payment Summary
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(order.totalAmount)}</span>
                                </div>
                                {/* Formatting could be detailed if tax/shipping breaks down */}
                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-lg font-bold text-blue-600">{formatCurrency(order.totalAmount)}</span>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-600">Status</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                                            {order.paymentStatus === PaymentStatus.SUCCESS ? "PAID" : order.paymentStatus}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Trans. ID</span>
                                        <span className="text-xs font-mono text-gray-500">
                                            {order.paymentId ? order.paymentId.slice(-8) : '-'}
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-gray-500" />
                                    Shipping Address
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-1 text-gray-600">
                                    <p className="font-medium text-gray-900 mb-2">{order.guest.name}</p>
                                    <p>{order.address.street}</p>
                                    <p>{order.address.city}, {order.address.state}</p>
                                    <p>{order.address.zip}</p>
                                    <p>{order.address.country}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="w-4 h-4" />
                                        {order.guest.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="w-4 h-4" />
                                        {order.guest.phone}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
