import React, { useState, useCallback } from "react";
import { AdminTable } from "../components/AdminTable";
import { departments } from "../api/superAdminApi";
import { DepartmentDTO } from "../dto/DepartmentDTO";
import useFetchList from "@/hooks/useFetchItem";
import { useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { DepartmentApiResponse } from "../dto/DepartmentApiResponse";

const DepartmentManagement: React.FC = () => {
  const id = useAppSelector((state) => state.auth.user?.id);
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetchDepartmentsFn = useCallback(
    () => departments(id!, page, limit, search),
    [id, page, limit, search, statusFilter]
  );

  const { data, loading, error } =
    useFetchList<DepartmentApiResponse>(fetchDepartmentsFn);

  const departmentData = data?.data?.departments ?? [];

  const total = data?.data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const columns = [
    { key: "name", label: "Department Name" },
    {
      key: "isActive",
      label: "Status",
      render: (item: DepartmentDTO) =>
        item.isActive ? (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
            Active
          </span>
        ) : (
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
            Inactive
          </span>
        ),
    },
    {
      key: "createdAt",
      label: "Created On",
      render: (item: DepartmentDTO) =>
        new Date(item.createdAt).toLocaleDateString(),
    },
  ];

  const handleEdit = (id: string) => {
    const department = departmentData.find((d) => d.id === id);
    if (department) {
      navigate("/admin/departments/form", {
        state: { existingData: department, departmentId: id },
      });
    } else {
      toast.error("Department not found");
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded-md w-60"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <Button
          size="lg"
          className="flex items-center gap-2 bg-[#0d52b4c8] hover:bg-[#0d53b4ef] text-white rounded-lg shadow-sm"
          onClick={() => navigate("/admin/departments/form")}
        >
          <Plus className="w-5 h-5" />
          <span>Add Department</span>
        </Button>
      </div>

      <AdminTable<DepartmentDTO>
        title="Departments"
        data={departmentData}
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

export default DepartmentManagement;
