import React, { useState, useCallback } from "react";
import { AdminTable } from "../components/AdminTable";
import { territories } from "../api/superAdminApi";
import { TerritoryDTO } from "../dto/TerritorySchema";
import useFetchItem from "@/hooks/useFetchItem";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const TerritorryManagement: React.FC = () => {
  const id = useSelector((state: any) => state.auth.user?.id);
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");


  const fetchTerritoriesFn = useCallback(async () => {
    const res = await territories(id);
    setTotalPages(res.totalPages || 1);
    return res.data || [];
  }, [id]);

  const {
    data: territoryData,
    loading,
    error,
  } = useFetchItem<TerritoryDTO[]>(fetchTerritoriesFn);

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
    if(!territoryData) return;
    const territory = territoryData.find((t) => t.id === id);
    if (territory) {
      navigate("/admin/territories/add", {
        state: { existingData: territory, territoryId: id },
      });
    }
  };

  if (!loading && (!territoryData || territoryData.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-50 p-4 rounded-xl shadow-md">
        <p className="text-gray-500 text-lg mb-4">No territories found.</p>
        <Button
          className="bg-[#ae3236]  hover:bg-[#970c13]"
          onClick={() => navigate("/admin/territories/add")}
        >
          Add Territory
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Button aligned to right */}
      <div className="flex justify-end mb-4">
        <Button
          size="lg"
          className="flex items-center gap-2 bg-[#0d52b4c8] hover:bg-[#0d53b4ef] text-white rounded-lg shadow-sm m-2"
          onClick={() => navigate("/admin/territories/add")}
        >
          <Plus className="w-5 h-5" />
          <span>Add New Territory</span>
        </Button>
      </div>

      {/* Table */}
      <AdminTable<TerritoryDTO>
        title="Territories"
        data={territoryData || []}
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
      />
    </>
  );
};

export default TerritorryManagement;
