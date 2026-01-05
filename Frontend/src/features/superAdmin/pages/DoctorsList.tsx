import useFetchList from "@/hooks/useFetchItem";
import { getAllDoctors, blockUser, unblockUser } from "../api/superAdminApi";
import { useCallback, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Doctor } from "../dto/Doctor";
import { DoctorResponse } from "../dto/DoctorResponse";
import { useNavigate } from "react-router-dom";
import { AdminTable } from "../components/AdminTable";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { getTerritories } from "@/features/shared/api/SharedApi";
import { Button } from "@/components/ui/button";

interface Territory {
  id: string;
  name: string;
}

const DoctorsList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 8;
  const [search, setSearch] = useState("");
  const [territory, setTerritory] = useState("");
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [territoriesLoading, setTerritoriesLoading] = useState(false);

  const fetchFn = useCallback(
    () => getAllDoctors(page, limit, search, territory),
    [page, limit, search, territory]
  );
  const { data, loading, error, setData } =
    useFetchList<DoctorResponse>(fetchFn);

  const [blockLoading, setBlockLoading] = useState<string | null>(null);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Fetch territories on component mount
  useEffect(() => {
    const fetchTerritories = async () => {
      try {
        setTerritoriesLoading(true);
        const response = await getTerritories();
        setTerritories(response.data.data || []);
      } catch {
        toast.error("Failed to load territories");
      } finally {
        setTerritoriesLoading(false);
      }
    };
    fetchTerritories();
  }, []);

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
    } catch {
      toast.error("Something went wrong while updating block status");
    } finally {
      setBlockLoading(null);
    }
  };

  const handleConfirmBlockToggle = async () => {
    if (!selectedDoctor) return;
    await handleBlockToggle(selectedDoctor);
    setConfirmDialogOpen(false);
    setSelectedDoctor(null);
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
    { key: "territory", label: "Territory" },
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

  const territoryFilter = (
    <div className="flex items-center gap-2">
      <select
        value={territory}
        onChange={(e) => {
          setTerritory(e.target.value);
          setPage(1); // Reset to first page when filter changes
        }}
        disabled={territoriesLoading}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 min-w-[200px]"
      >
        <option value="">All Territories</option>
        {territories.map((terr) => (
          <option key={terr.id} value={terr.id}>
            {terr.name}
          </option>
        ))}
      </select>
      {territory && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setTerritory("");
            setPage(1);
          }}
        >
          Clear
        </Button>
      )}
    </div>
  );

  return (
    <>
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
        onBlockToggle={(doctor) => {
          setSelectedDoctor(doctor);
          setConfirmDialogOpen(true);
        }}
        blockLoadingId={blockLoading}
        getId={(d) => d.id}
        isBlocked={(d) => d.isBlocked}
        filters={territoryFilter}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        title={selectedDoctor?.isBlocked ? "Unblock Doctor" : "Block Doctor"}
        message={
          selectedDoctor?.isBlocked
            ? `Are you sure you want to unblock Dr. ${selectedDoctor?.name}?`
            : `Are you sure you want to block Dr. ${selectedDoctor?.name}?`
        }
        onConfirm={handleConfirmBlockToggle}
        onCancel={() => {
          setConfirmDialogOpen(false);
          setSelectedDoctor(null);
        }}
        confirmButtonClassName={
          selectedDoctor?.isBlocked
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-red-600 text-white hover:bg-red-700"
        }
      />
    </>
  );
};

export default DoctorsList;
