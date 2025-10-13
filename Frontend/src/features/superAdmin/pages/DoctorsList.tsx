import useFetchList from "@/hooks/useFetchItem";
import { getAllDoctors, blockUser, unblockUser } from "../api/superAdminApi";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { Doctor } from "../Schemas/Doctor";
import { DoctorResponse } from "../Schemas/DoctorResponse";
import { useNavigate } from "react-router-dom";
import { AdminTable } from "../components/AdminTable";

const DoctorsList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 8;
  const [search, setSearch] = useState("");

  const fetchFn = useCallback(
    () => getAllDoctors(page, limit, search),
    [page, limit, search]
  );
  const { data, loading, error, setData } =
    useFetchList<DoctorResponse>(fetchFn);
  const [blockLoading, setBlockLoading] = useState<string | null>(null);

  const doctors = data?.doctors ?? [];
  const total = data?.total ?? 0;
  const totalPage = Math.ceil(total / 10);

  const handleBlockToggle = async (doctor: Doctor) => {
    try {
      setBlockLoading(doctor.loginId);
      let userUpdated;
      if (doctor.isBlocked) {
        const res = await unblockUser(doctor.loginId);
        userUpdated = res?.updatedUser;
        toast.success(res.message);
      } else {
        const res = await blockUser(doctor.loginId);
        userUpdated = res?.updatedUser;
        toast.success(res.message);
      }

      setData((prev) =>
        prev
          ? {
              ...prev,
              doctors: prev.doctors.map((doc) =>
                doc.id === doctor.id
                  ? { ...doc, isBlocked: userUpdated.isBlocked }
                  : doc
              ),
            }
          : prev
      );
    } catch (err) {
      console.log("falied to toggle block button", err);
      alert("Something went wrong while updating block status");
    } finally {
      setBlockLoading(null);
    }
  };

  const handleDetailPage = async (id: string) => {
    if (id) {
      navigate(`/admin/doctors/${id}`);
    } else {
      toast.error("Invalid request");
    }
  };
  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "hospital", label: "Hospital" },
    {
      key: "createdAt",
      label: "Registration Date",
      render: (d: Doctor) => new Date(d.createdAt).toLocaleDateString(),
    },
    {
      key: "isBlocked",
      label: "Status",
      render: (d: Doctor) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            d.isBlocked
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {d.isBlocked ? "Blocked" : "Active"}
        </span>
      ),
    },
  ];

  return (
    <AdminTable
      title="Doctors Management"
      data={doctors}
      columns={columns}
      loading={loading}
      error={error}
      page={page}
      totalPages={totalPage}
      onPageChange={setPage}
      search={search}
      onSearchChange={setSearch}
      onView={handleDetailPage}
      onBlockToggle={handleBlockToggle}
      blockLoadingId={blockLoading}
      getId={(d) => d.id}
      isBlocked={(d) => d.isBlocked}
    />
  );
};

export default DoctorsList;
