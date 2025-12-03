import useFetchList from "@/hooks/useFetchItem";
import { getAllReps, blockUser, unblockUser } from "../api/superAdminApi";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MedicalRep } from "../dto/MedicalRep";
import { MedicalRepResponse } from "../dto/MedicalRepResponse";
import { AdminTable } from "../components/AdminTable";
import ConfirmDialog from "@/components/shared/ConfirmDialog";  

const RepsList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 8;
  const [search, setSearch] = useState("");

  const fetchFn = useCallback(
    () => getAllReps(page, limit, search),
    [page, limit, search]
  );

  const { data, loading, error, setData } =
    useFetchList<MedicalRepResponse>(fetchFn);

  const [blockLoading, setBlockLoading] = useState<string | null>(null);

  // ⬇️ added confirm dialog states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedRep, setSelectedRep] = useState<MedicalRep | null>(null);

  const reps = data?.reps ?? [];
  const total = data?.total ?? 0;
  const totalPage = Math.ceil(total / limit);

  const handleBlockToggle = async (rep: MedicalRep) => {
    try {
      setBlockLoading(rep.loginId);

      let userUpdated;
      if (rep.isBlocked) {
        const res = await unblockUser(rep.loginId);
        userUpdated = res.updatedUser;
        toast.success(res.message);
      } else {
        const res = await blockUser(rep.loginId);
        userUpdated = res.updatedUser;
        toast.success(res.message);
      }

      setData((prev) =>
        prev
          ? {
              ...prev,
              reps: prev.reps.map((doc) =>
                doc.id === rep.id
                  ? { ...doc, isBlocked: userUpdated.isBlocked }
                  : doc
              ),
            }
          : prev
      );
    } catch {
      toast.error("Something went wronn on updating block status");
    } finally {
      setBlockLoading(null);
    }
  };

  const handleConfirmBlockToggle = async () => {
    if (!selectedRep) return;
    await handleBlockToggle(selectedRep);
    setConfirmDialogOpen(false);
    setSelectedRep(null);
  };

  const handleDetailPage = (id: string) => {
    if (id) {
      navigate(`/admin/reps/${id}`);
    } else {
      toast.error("Invalid request");
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "employeeId", label: "Employee Id" },
    {
      key: "subscriptionStatus",
      label: "Subscription Status",
      render: (rep: MedicalRep) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            rep.subscriptionStatus
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {rep.subscriptionStatus ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Registration Date",
      render: (rep: MedicalRep) => new Date(rep.createdAt).toLocaleDateString(),
    },
    {
      key: "isBlocked",
      label: "Status",
      render: (rep: MedicalRep) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            rep.isBlocked
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {rep.isBlocked ? "Blocked" : "Active"}
        </span>
      ),
    },
  ];

  return (
    <>
      <AdminTable<MedicalRep>
        title="Medical Reps Management"
        data={reps}
        columns={columns}
        loading={loading}
        error={error}
        page={page}
        totalPages={totalPage}
        onPageChange={setPage}
        search={search}
        onSearchChange={setSearch}
        onView={handleDetailPage}
        onBlockToggle={(rep) => {
          setSelectedRep(rep);
          setConfirmDialogOpen(true);
        }}
        blockLoadingId={blockLoading}
        getId={(rep) => rep.id}
        isBlocked={(rep) => !!rep.isBlocked}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        title={selectedRep?.isBlocked ? "Unblock Medical Rep" : "Block Medical Rep"}
        message={
          selectedRep?.isBlocked
            ? `Are you sure you want to unblock ${selectedRep?.name}?`
            : `Are you sure you want to block ${selectedRep?.name}?`
        }
        onConfirm={handleConfirmBlockToggle}
        onCancel={() => {
          setConfirmDialogOpen(false);
          setSelectedRep(null);
        }}
        confirmButtonClassName={
          selectedRep?.isBlocked
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-red-600 text-white hover:bg-red-700"
        }
      />
    </>
  );
};

export default RepsList;
