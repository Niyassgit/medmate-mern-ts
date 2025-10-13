import { Button } from "@/components/ui/button";
import AppPagination from "@/components/shared/AppPagination";
import SearchInput from "./SearchInput";

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
  onBlockToggle?: (item: T) => void;
  blockLoadingId?: string | null;
  getId: (item: T) => string;
  isBlocked?: (item: T) => boolean;
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
  onBlockToggle,
  blockLoadingId,
  getId,
  isBlocked,
}: AdminTableProps<T>) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="font-bold text-2xl text-gray-600 mb-3">{title}</h1>

      {onSearchChange && (
        <div className="flex items-center gap-2 p-2">
          <SearchInput
            value={search ?? ""}
            onChange={onSearchChange}
            placeholder={`Search ${title.toLowerCase()}...`}
          />
        </div>
      )}

      <div className="p-6 bg-white rounded-xl shadow-md mt-3">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500">No records found</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-medium">
                {columns.map((col) => (
                  <th key={String(col.key)} className="p-3">
                    {col.label}
                  </th>
                ))}
                {(onView || onBlockToggle) && (
                  <th className="p-3 text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => {
                const id = getId(item);
                const blocked = isBlocked ? isBlocked(item) : false;
                return (
                  <tr key={id} className="border-b hover:bg-gray-50">
                    {columns.map((col) => (
                      <td key={String(col.key)} className="p-3">
                        {col.render
                          ? col.render(item)
                          : typeof col.key === "string" && col.key in item
                          ? (item[col.key as keyof T] as any)
                          : null}
                      </td>
                    ))}
                    {(onView || onBlockToggle) && (
                      <td className="p-3 flex justify-center gap-2">
                        {onView && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onView(id)}
                          >
                            View
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

      <AppPagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
