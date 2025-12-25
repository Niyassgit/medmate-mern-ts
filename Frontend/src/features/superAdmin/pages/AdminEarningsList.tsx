import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { getAdminEarningsList } from "../api/superAdminApi";
import { getCurrentMonthRange } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

interface AdminEarnings {
    doctorId: string;
    doctorName: string;
    department: string;
    totalPrescriptions: number;
    paidOrders: number;
    grossSales: number;
    adminEarnings: number;
}

const AdminEarningsList = () => {
    const navigate = useNavigate();
    const { startDate: defaultStart, endDate: defaultEnd } =
        getCurrentMonthRange();
    const [searchParams] = useSearchParams();

    const [earnings, setEarnings] = useState<AdminEarnings[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Filters from URL or default
    const [startDate, setStartDate] = useState(
        searchParams.get("startDate") || defaultStart
    );
    const [endDate, setEndDate] = useState(
        searchParams.get("endDate") || defaultEnd
    );

    const fetchEarnings = async () => {
        setLoading(true);
        try {
            const res = await getAdminEarningsList(page, 10, startDate, endDate);
            const data = res.data;

            if (data.length < 10) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            if (page === 1) {
                setEarnings(data);
            } else {
                setEarnings((prev) => [...prev, ...data]);
            }
        } catch (error) {
            console.error("Failed to fetch admin earnings", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEarnings();
    }, [page, startDate, endDate]);

    const handleApplyFilter = () => {
        setPage(1);
        fetchEarnings();
    };

    return (
        <div className="p-6 space-y-6">
            <Button onClick={() => navigate(-1)}>
                <MoveLeft />
            </Button>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Admin Earnings</h1>
                    <p className="text-sm text-muted-foreground">
                        View admin earnings breakdown by doctor
                    </p>
                </div>
            </div>

            {/* FILTER */}
            <Card className="p-4 flex flex-wrap gap-4 items-end">
                <div>
                    <label className="text-xs text-muted-foreground">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-muted-foreground">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border rounded px-3 py-2 text-sm"
                    />
                </div>
                <button
                    onClick={handleApplyFilter}
                    className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700"
                >
                    Apply
                </button>
            </Card>

            {/* TABLE */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Doctor Name</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead className="text-right">Prescriptions</TableHead>
                            <TableHead className="text-right">Paid Orders</TableHead>
                            <TableHead className="text-right">Gross Sales</TableHead>
                            <TableHead className="text-right">Admin Earnings</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && page === 1 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : earnings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">
                                    No records found
                                </TableCell>
                            </TableRow>
                        ) : (
                            earnings.map((item) => (
                                <TableRow key={item.doctorId}>
                                    <TableCell className="font-medium">
                                        {item.doctorName}
                                    </TableCell>
                                    <TableCell>{item.department}</TableCell>
                                    <TableCell className="text-right">
                                        {item.totalPrescriptions}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {item.paidOrders}
                                    </TableCell>
                                    <TableCell className="text-right text-green-600 font-semibold">
                                        ₹{item.grossSales.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right text-purple-600 font-bold">
                                        ₹{item.adminEarnings.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    {earnings.length > 0 && (
                        <TableFooter
                            grossSales={earnings.reduce((sum, item) => sum + item.grossSales, 0)}
                            totalEarnings={earnings.reduce((sum, item) => sum + item.adminEarnings, 0)}
                        />
                    )}
                </Table>

                {hasMore && !loading && (
                    <div className="p-4 flex justify-center">
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            className="text-sm text-purple-600 hover:underline"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
};

const TableFooter = ({ grossSales, totalEarnings }: { grossSales: number, totalEarnings: number }) => {
    return (
        <TableBody className="bg-muted/50 font-medium">
            <TableRow>
                <TableCell colSpan={2}>Total (Current Page)</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right text-green-700">₹{grossSales.toFixed(2)}</TableCell>
                <TableCell className="text-right text-purple-700">₹{totalEarnings.toFixed(2)}</TableCell>
            </TableRow>
        </TableBody>
    )
}

export default AdminEarningsList;
