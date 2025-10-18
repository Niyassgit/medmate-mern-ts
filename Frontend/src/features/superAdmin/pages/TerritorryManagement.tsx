import React, { useState, useCallback } from "react";
import { AdminTable } from "../components/AdminTable";
import { territories } from "../api/superAdminApi";
import { TerritoryDTO } from "../dto/TerritorySchema";
import useFetchItem from "@/hooks/useFetchItem";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TerritorryManagement: React.FC = () => {
  const id = useSelector((state: any) => state.auth.user?.id);
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  // Fetch function wrapped in useCallback
  const fetchTerritoriesFn = useCallback(async () => {
    const res = await territories(id);
    setTotalPages(res.totalPages || 1);
    return res.data || [];
  }, [id]);

  const { data: territoryData, loading, error } =
    useFetchItem<TerritoryDTO[]>(fetchTerritoriesFn);

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

  const handleView = (id: string) => {
    console.log("View clicked:", id);
    // Navigate to territory details page if needed
  };

  if (!loading && (!territoryData || territoryData.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-50 p-4 rounded-xl shadow-md">
        <p className="text-gray-500 text-lg mb-4">No territories found.</p>
       <Button 
       className="bg-[#ae3236]  hover:bg-[#970c13]"
       onClick={()=>navigate("/admin/territory/add")}
       >Add Territory</Button>
      </div>
    );
  }

  return (
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
      onView={handleView}
      getId={(item) => item.id}
    />
  );
};

export default TerritorryManagement;
