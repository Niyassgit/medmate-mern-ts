import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BaseUser {
  id: string;
  name: string;
  image?: string | null;
}

interface DoctorUser extends BaseUser {
  hospital?: string | null;
  specialty?: string | null;
  territory?: string | null;
}

interface RepUser extends BaseUser {
  company?: string | null;
  phone?: string | null;
  speciality?: string | null;
}

interface ConnectionTableProps {
  data: DoctorUser[] | RepUser[];
  type: "doctor" | "rep";
}

const ConnectionTable = ({ data, type }: ConnectionTableProps) => {
  const navigate = useNavigate();
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={type === "doctor" ? 4 : 4}
                className="text-center py-6 text-muted-foreground"
              >
                No {type === "doctor" ? "doctors" : "representatives"} found.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">Name</TableHead>
            {type === "doctor" ? (
              <>
                <TableHead className="font-semibold">
                  Hospital / Clinic
                </TableHead>
                <TableHead className="font-semibold">Specialty</TableHead>
                <TableHead className="font-semibold">Territory</TableHead>
              </>
            ) : (
              <>
                <TableHead className="font-semibold">Company</TableHead>
                <TableHead className="font-semibold">Phone</TableHead>
                <TableHead className="font-semibold">Specialty</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/50">
              <TableCell
                className="font-medium flex items-center gap-3 cursor-pointer"
                onClick={() =>
                  type === "rep"
                    ? navigate(`/doctor/rep/details/${(item as RepUser).id}`)
                    : navigate(`/rep/doctor/details/${(item as DoctorUser).id}`)
                }
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-8 h-8 rounded-full hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:opacity-80 transition-opacity">
                    <UserCircle2 className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <span className="hover:underline">{item.name}</span>
              </TableCell>

              {type === "doctor" ? (
                <>
                  <TableCell className="text-muted-foreground cursor-pointer">
                    {(item as DoctorUser).hospital ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {(item as DoctorUser).specialty ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {(item as DoctorUser).territory ?? "—"}
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell
                    className="text-muted-foreground"
                  >
                    {(item as RepUser).company ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {(item as RepUser).phone ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {(item as RepUser).speciality ?? "—"}
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ConnectionTable;
