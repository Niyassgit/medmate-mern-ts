import useFetchList from "@/hooks/useFetchItem";
import { getAllReps, blockUser, unblockUser } from "../api/superAdminApi";
import { useCallback, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MedicalRep } from "../dto/MedicalRep";
import { MedicalRepResponse } from "../dto/MedicalRepResponse";
import { AdminTable } from "../components/AdminTable";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { getTerritories } from "@/features/shared/api/SharedApi";
import { Button } from "@/components/ui/button";  

interface Territory {
  id: string;
  name: string;
}

const RepsList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 8;
  const [search, setSearch] = useState("");
  const [territory, setTerritory] = useState("");
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [territoriesLoading, setTerritoriesLoading] = useState(false);

  const fetchFn = useCallback(
    () => getAllReps(page, limit, search, territory),
    [page, limit, search, territory]
  );

  const { data, loading, error, setData } =
    useFetchList<MedicalRepResponse>(fetchFn);

  const [blockLoading, setBlockLoading] = useState<string | null>(null);

  // ⬇️ added confirm dialog states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedRep, setSelectedRep] = useState<MedicalRep | null>(null);

  // Fetch territories on component mount
  useEffect(() => {
    const fetchTerritories = async () => {
      try {
        setTerritoriesLoading(true);
        const response = await getTerritories();
        setTerritories(response.data.data || []);
      } catch (err) {
        toast.error("Failed to load territories");
      } finally {
        setTerritoriesLoading(false);
      }
    };
    fetchTerritories();
  }, []);

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
    {
      key: "territoryNames",
      label: "Territories",
      render: (rep: MedicalRep) => (
        <div className="flex flex-wrap gap-1">
          {rep.territoryNames && rep.territoryNames.length > 0 ? (
            rep.territoryNames.map((territory, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
              >
                {territory}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">No territories</span>
          )}
        </div>
      ),
    },
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
        filters={territoryFilter}
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
