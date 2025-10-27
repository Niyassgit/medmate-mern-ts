import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DoctorListOnAnalyticsDTO } from "../dto/DoctorListOnAnalyticsDTO";

interface DoctorsTableProps {
  doctors: DoctorListOnAnalyticsDTO[];
}

const ConnectionTable = ({doctors}:DoctorsTableProps) => {
 
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Inactive":
        return "secondary";
      case "Pending":
        return "outline";
      default:
        return "outline";
    }
  };

   return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">Doctor Name</TableHead>
            <TableHead className="font-semibold">Hospital / Clinic</TableHead>
            <TableHead className="font-semibold">Specialty</TableHead>
            <TableHead className="font-semibold">Territory</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <TableRow key={doctor.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{doctor.name}</TableCell>
                <TableCell className="text-muted-foreground">{doctor.hospital}</TableCell>
                <TableCell className="text-muted-foreground">
                  {doctor.specialty ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {doctor.territory ?? "—"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                No connected doctors found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ConnectionTable;
