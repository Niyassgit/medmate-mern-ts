import React, { useState, useCallback } from "react";
import { AdminTable } from "../components/AdminTable";
import { territories } from "../api/superAdminApi";
import { TerritoryDTO } from "../dto/TerritoryDTO";
import useFetchItem from "@/hooks/useFetchItem";
import { useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TerritoryApiResponse } from "../dto/TerritoryApiResponse";

const TerritorryManagement: React.FC = () => {
  const id = useAppSelector((state) => state.auth.user?.id);
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [search, setSearch] = useState<string>("");

  const fetchTerritoriesFn = useCallback(
    () => territories(id, page, limit, search),
    [id, page, limit, search]
  );
  const { data, loading, error } =
    useFetchItem<TerritoryApiResponse>(fetchTerritoriesFn);
  const territoryData = data?.data?.territories ?? [];
  const total = data?.data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const columns = [
    { key: "name", label: "Territory Name" },
    { key: "region", label: "Region" },
    {
      key: "createdAt",
      label: "Created On",
      render: (item: TerritoryDTO) =>
        new Date(item.createdAt).toLocaleDateString(),
    },
  ];

  const handleEdit = (id: string) => {
    if (!territoryData) return;
    const territory = territoryData.find((t) => t.id === id);
    if (territory) {
      navigate("/admin/territories/form", {
        state: { existingData: territory, territoryId: id },
      });
    }
  };

  const handleDetails = (territoryId: string) => {
    navigate(`/admin/territories/${territoryId}`);
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search territory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded-md w-60"
          />
        </div>

        <Button
          size="lg"
          className="flex items-center gap-2 bg-[#0d52b4c8] hover:bg-[#0d53b4ef] text-white rounded-lg shadow-sm"
          onClick={() => navigate("/admin/territories/form")}
        >
          <Plus className="w-5 h-5" />
          <span>Add Territory</span>
        </Button>
      </div>

      <AdminTable<TerritoryDTO>
        title="Territories"
        data={territoryData}
        columns={columns}
        loading={loading}
        error={error || null}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        search={search}
        onSearchChange={setSearch}
        onEdit={handleEdit}
        getId={(item) => item.id}
        onView={handleDetails}
      />
    </>
  );
};

export default TerritorryManagement;
