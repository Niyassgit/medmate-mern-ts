import { Button } from "@/components/ui/button";
import AppPagination from "@/components/shared/AppPagination";
import SearchInput from "./SearchInput";
import { Pencil } from "lucide-react";
import React from "react";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  loading: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onBlockToggle?: (item: T) => void;
  blockLoadingId?: string | null;
  getId: (item: T) => string;
  isBlocked?: (item: T) => boolean;
  filters?: React.ReactNode;
}

export function AdminTable<T extends object>({
  title,
  data,
  columns,
  loading,
  error,
  page,
  totalPages,
  onPageChange,
  search,
  onSearchChange,
  onView,
  onEdit,
  onBlockToggle,
  blockLoadingId,
  getId,
  isBlocked,
  filters,
}: AdminTableProps<T>) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header Section */}
      <h1 className="font-bold text-2xl text-gray-700 mb-3">{title}</h1>

      {/* Search and Filters */}
      {(onSearchChange || filters) && (
        <div className="flex items-center gap-2 p-2 flex-wrap">
          {onSearchChange && (
            <SearchInput
              value={search ?? ""}
              onChange={onSearchChange}
              placeholder={`Search ${title.toLowerCase()}...`}
            />
          )}
          {filters}
        </div>
      )}

      {/* Table Container */}
      <div className="p-6 bg-white rounded-xl shadow-md mt-3 overflow-x-auto">
        {loading ? (
          <p className="text-gray-500 text-center py-6">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-6">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No records found.</p>
        ) : (
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
                {columns.map((col) => (
                  <th key={String(col.key)} className="p-3">
                    {col.label}
                  </th>
                ))}
                {(onView || onEdit || onBlockToggle) && (
                  <th className="p-3 text-center w-48">Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {data.map((item) => {
                const id = getId(item);
                const blocked = isBlocked ? isBlocked(item) : false;

                return (
                  <tr
                    key={id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    {columns.map((col) => (
                      <td key={String(col.key)} className="p-3 text-gray-700">
                        {col.render
                          ? col.render(item)
                          : typeof col.key === "string" && col.key in item
                          ? (item[col.key as keyof T] as any)
                          : null}
                      </td>
                    ))}

                    {(onView || onEdit || onBlockToggle) && (
                      <td className="p-3 text-center space-x-2 whitespace-nowrap">
                        {onView && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onView(id)}
                          >
                            View
                          </Button>
                        )}

                        {onEdit && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onEdit(id)}
                            className="inline-flex items-center justify-center"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}

                        {onBlockToggle && (
                          <Button
                            variant={blocked ? "default" : "destructive"}
                            size="sm"
                            onClick={() => onBlockToggle(item)}
                            disabled={blockLoadingId === id}
                          >
                            {blocked ? "Unblock" : "Block"}
                          </Button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <AppPagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
