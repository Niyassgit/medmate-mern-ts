import useFetchItem from "@/hooks/useFetchItem";
import  { useCallback, useState } from "react";
import { territoryDetails } from "../api/superAdminApi";
import { useNavigate, useParams } from "react-router-dom";
import { SpinnerButton } from "@/components/shared/SpinnerButton";
import AppPagination from "@/components/shared/AppPagination";
import { Role } from "@/types/Role";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
  role: Role;
  department?: string;
  phone?: string;
}

interface TerritoryResponse {
  users: User[];
  count: number;
}

type FilterRole = "all" | "DOCTOR" | "MEDICAL_REP" | "GUEST";

const TerritoryDetails = () => {
  const { territoryId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [currentFilter, setCurrentFilter] = useState<FilterRole>("all");
  const limit = 20;

  const fetchUsers = useCallback(
    () => territoryDetails(territoryId!, page, limit),
    [territoryId, page]
  );

  const {
    data: territoryData,
    error,
    loading,
  } = useFetchItem<TerritoryResponse>(fetchUsers);

  const users = territoryData?.users || [];
  const totalCount = territoryData?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const filteredUsers =
    currentFilter === "all"
      ? users
      : users.filter((user) => user.role === currentFilter);

  const getRoleBadgeColor = (role: string): string => {
    const colorMap: { [key: string]: string } = {
      DOCTOR: "bg-green-100 text-green-800",
      MEDICAL_REP: "bg-blue-100 text-blue-800",
      GUEST: "bg-orange-100 text-orange-800",
    };
    return colorMap[role] || "bg-gray-100 text-gray-800";
  };

  if (loading) return <SpinnerButton />;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <Button
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
              onClick={() => navigate(-1)}
            >
              ← Back
            </Button>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                User Management
              </h1>
              <p className="text-gray-600">
                Manage and filter system users by role
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-lg shadow-lg p-5 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-semibold text-gray-700">
              Filter by Role:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCurrentFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentFilter === "all"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                All Users
              </button>
              <button
                onClick={() => setCurrentFilter("DOCTOR")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentFilter === "DOCTOR"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Doctors
              </button>
              <button
                onClick={() => setCurrentFilter("MEDICAL_REP")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentFilter === "MEDICAL_REP"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Medical Reps
              </button>
              <button
                onClick={() => setCurrentFilter("GUEST")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentFilter === "GUEST"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Guests
              </button>
            </div>
            <div className="ml-auto flex gap-3">
              <span className="px-4 py-2 bg-gray-50 rounded-full text-sm font-semibold text-gray-700">
                Total: {totalCount}
              </span>
              <span className="px-4 py-2 bg-gray-50 rounded-full text-sm font-semibold text-gray-700">
                Showing: {filteredUsers.length}
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-indigo-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Phone
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-16 h-16 mb-4 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">
                          No users found
                        </h3>
                        <p className="text-sm text-gray-500">
                          Try selecting a different filter
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {user.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {user.department || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700 font-mono">
                          {user.phone}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <AppPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TerritoryDetails;
