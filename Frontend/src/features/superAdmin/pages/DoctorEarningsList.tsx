import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { getDoctorEarningsList } from "../api/superAdminApi";
import { getCurrentMonthRange } from "@/lib/utils";

interface DoctorEarnings {
  doctorId: string;
  doctorName: string;
  email: string;
  department: string;
  totalPrescriptions: number;
  paidOrders: number;
  grossSales: number;
  totalCommission: number;
}

const DoctorEarningsList = () => {
  const { startDate: defaultStart, endDate: defaultEnd } =
    getCurrentMonthRange();
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState<DoctorEarnings[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || defaultStart
  );
  const [endDate, setEndDate] = useState(
    searchParams.get("endDate") || defaultEnd
  );

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const res: any = await getDoctorEarningsList(
        page,
        limit,
        startDate,
        endDate
      );
      setDoctors(res.data);
    } catch (err) {
      console.error("Failed to fetch doctor earnings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [page, startDate, endDate]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Doctor Earnings</h1>
          <p className="text-sm text-gray-400">
            Detailed commission report per doctor
          </p>
        </div>
      </div>

      {/* ================= DATE FILTER ================= */}
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
          onClick={() => {
            setPage(1);
            fetchEarnings();
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700"
        >
          Apply
        </button>
      </Card>

      <Card className="p-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Prescriptions</TableHead>
                <TableHead>Paid Orders</TableHead>
                <TableHead>Gross Sales</TableHead>
                <TableHead>Total Earnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                doctors.map((doctor) => (
                  <TableRow key={doctor.doctorId}>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{doctor.doctorName}</p>
                        <p className="text-xs text-gray-400">{doctor.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{doctor.department}</TableCell>
                    <TableCell>{doctor.totalPrescriptions}</TableCell>
                    <TableCell>{doctor.paidOrders}</TableCell>
                    <TableCell>₹{doctor.grossSales.toFixed(2)}</TableCell>
                    <TableCell className="font-bold text-green-600">
                      ₹{doctor.totalCommission.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="font-bold text-right">
                  Total
                </TableCell>
                <TableCell className="font-bold">
                  ₹
                  {doctors
                    .reduce((acc, curr) => acc + curr.grossSales, 0)
                    .toFixed(2)}
                </TableCell>
                <TableCell className="font-bold text-green-600">
                  ₹
                  {doctors
                    .reduce((acc, curr) => acc + curr.totalCommission, 0)
                    .toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}

        {/* Pagination controls could go here */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={doctors.length < limit}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </Card>
    </div >
  );
};

export default DoctorEarningsList;
