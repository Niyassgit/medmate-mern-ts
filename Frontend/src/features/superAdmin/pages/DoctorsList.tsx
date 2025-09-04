import { Button } from "@/components/ui/button";
import AdminNavbar from "@/components/navbar/AdminNavbar";
import useFetchList from "@/hooks/useFetchList";
import { getAllDoctors } from "../api/superAdminApi";

interface Doctor {
  id: string;
  name: string;
  phone: string;
  hospital: string;
  email: string;
  isBlocked: boolean;
  createdAt: string;
}

const DoctorsList = () => {
  const { data: doctors, loading, error } = useFetchList<Doctor>(getAllDoctors);
  const handleBlockToggle = (id: string) => {};

  return (
    <>
      <AdminNavbar />

      <div className="h-screen bg-gray-50 p-4">
        <span className="font-bold text-2xl text-gray-600">
          Doctors Management
        </span>

        <div className="p-6 bg-white rounded-xl shadow-md mt-3">
          <h2 className="text-xl font-semibold mb-4">Registered Doctors</h2>

          {loading ? (
            <p className="text-gray-500">Loading doctors...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : doctors.length === 0 ? (
            <p className="text-gray-500">No doctors found</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-medium">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Hospital</th>
                  <th className="p-3">Registration Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{doctor.name}</td>
                    <td className="p-3">{doctor.email}</td>
                    <td className="p-3">{doctor.phone}</td>
                    <td className="p-3">{doctor.hospital}</td>
                    <td className="p-3">
                      {new Date(doctor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          doctor.isBlocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {doctor.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="p-3 flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert(`Viewing ${doctor.name}`)}
                      >
                        View
                      </Button>
                      <Button
                        variant={
                          doctor.isBlocked ? "default" : "destructive"
                        }
                        size="sm"
                        onClick={() => handleBlockToggle(doctor.id)}
                      >
                        {doctor.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorsList;
