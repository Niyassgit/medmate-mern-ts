import { getAllGuests, blockUser, unblockUser } from "../api/superAdminApi";
import { useCallback, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Guest } from "../dto/Guest";
import { GuestResponse } from "../dto/GuestResponse";
import { AdminTable } from "../components/AdminTable";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { getTerritories } from "@/features/shared/api/SharedApi";
import { Button } from "@/components/ui/button";
import useFetchItem from "@/hooks/useFetchItem";

interface Territory {
  id: string;
  name: string;
}

const Guests = () => {
  const [page, setPage] = useState(1);
  const limit = 8;
  const [search, setSearch] = useState("");
  const [territory, setTerritory] = useState("");
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [territoriesLoading, setTerritoriesLoading] = useState(false);

  const fetchFn = useCallback(
    () => getAllGuests(page, limit, search, territory),
    [page, limit, search, territory]
  );

  const { data, loading, error, setData } =
    useFetchItem<GuestResponse>(fetchFn);

  const [blockLoading, setBlockLoading] = useState<string | null>(null);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

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

  const guests = data?.guests ?? [];
  const total = data?.total ?? 0;
  const totalPage = Math.ceil(total / limit);

  const handleBlockToggle = async (guest: Guest) => {
    if (!guest.loginId) {
      toast.error("Invalid guest user ID");
      return;
    }

    try {
      setBlockLoading(guest.loginId);

      let userUpdated;
      if (guest.isBlocked) {
        const res = await unblockUser(guest.loginId);
        userUpdated = res.updatedUser;
        toast.success(res.message);
      } else {
        const res = await blockUser(guest.loginId);
        userUpdated = res.updatedUser;
        toast.success(res.message);
      }

      setData((prev) =>
        prev
          ? {
              ...prev,
              guests: prev.guests.map((g) =>
                g.id === guest.id
                  ? { ...g, isBlocked: userUpdated.isBlocked }
                  : g
              ),
            }
          : prev
      );
    } catch {
      toast.error("Something went wrong updating block status");
    } finally {
      setBlockLoading(null);
    }
  };

  const handleConfirmBlockToggle = async () => {
    if (!selectedGuest) return;
    await handleBlockToggle(selectedGuest);
    setConfirmDialogOpen(false);
    setSelectedGuest(null);
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "territory",
      label: "Territory",
      render: (guest: Guest) => (
        <span className="text-gray-700">
          {guest.territory || (
            <span className="text-gray-400 text-xs">No territory</span>
          )}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Registration Date",
      render: (guest: Guest) =>
        guest.createdAt
          ? new Date(guest.createdAt).toLocaleDateString()
          : "N/A",
    },
    {
      key: "isBlocked",
      label: "Status",
      render: (guest: Guest) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            guest.isBlocked
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {guest.isBlocked ? "Blocked" : "Active"}
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
          setPage(1);
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
      <AdminTable<Guest>
        title="Guests Management"
        data={guests}
        columns={columns}
        loading={loading}
        error={error}
        page={page}
        totalPages={totalPage}
        onPageChange={setPage}
        search={search}
        onSearchChange={setSearch}
        onBlockToggle={(guest) => {
          setSelectedGuest(guest);
          setConfirmDialogOpen(true);
        }}
        blockLoadingId={blockLoading}
        getId={(guest) => guest.id}
        isBlocked={(guest) => !!guest.isBlocked}
        filters={territoryFilter}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        title={selectedGuest?.isBlocked ? "Unblock Guest" : "Block Guest"}
        message={
          selectedGuest?.isBlocked
            ? `Are you sure you want to unblock ${selectedGuest?.name}?`
            : `Are you sure you want to block ${selectedGuest?.name}?`
        }
        onConfirm={handleConfirmBlockToggle}
        onCancel={() => {
          setConfirmDialogOpen(false);
          setSelectedGuest(null);
        }}
        confirmButtonClassName={
          selectedGuest?.isBlocked
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-red-600 text-white hover:bg-red-700"
        }
      />
    </>
  );
};

export default Guests;
