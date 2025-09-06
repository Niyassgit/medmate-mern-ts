import { Button} from "@/components/ui/button";
import AdminNavbar from "@/components/navbar/AdminNavbar";
import useFetchList from "@/hooks/useFetchList";
import { getAllDoctors ,blockUser,unblockUser} from "../api/superAdminApi";
import { useState } from "react";
import { Pagination,PaginationContent,PaginationEllipsis,PaginationItem,PaginationLink,PaginationNext,PaginationPrevious } from "@/components/ui/pagination";


interface Doctor {
  id: string;
  name: string;
  phone: string;
  hospital: string;
  email: string;
  isBlocked: boolean;
  createdAt: string;
  loginId:string;
}

const DoctorsList = () => {
  const { data: doctors, loading, error,setData} = useFetchList<Doctor>(getAllDoctors);
  const [blockLoading,setBlockLoading]=useState<string|null>(null);
  const handleBlockToggle = async(doctor:Doctor) => {

   console.log("blocking doctor details:",doctor);

    try {
        setBlockLoading(doctor.loginId);
     let userUpdated;
     if(doctor.isBlocked){
      const res=await unblockUser(doctor.loginId);
      userUpdated=res?.updatedUser;
     }else{
      const res=await blockUser(doctor.loginId);
      userUpdated=res?.updatedUser;
     }


     setData((prev)=>(
      prev.map((doc)=>doc.id===doctor.id?{...doc,isBlocked:userUpdated.isBlocked}:doc)
     ));
      
    } catch (err) {
      console.log("falied to toggle block button",err);
      alert("Something went wrong while updating block status");
    }finally{
      setBlockLoading(null);
    }

   
  };

  return (
    <>
      <AdminNavbar />

      <div className=" bg-gray-50 p-4">
        <span className="font-bold text-2xl text-gray-600">
          Doctors Management
        </span>

        <div className="p-6  bg-white rounded-xl shadow-md mt-3">
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
                        {doctor.isBlocked === undefined?"Unknown":doctor.isBlocked ? "Blocked" : "Active"}
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
                        disabled={blockLoading===doctor.loginId}
                        onClick={() => handleBlockToggle(doctor)}
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
 
         <div className="m-2">
            <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#"/>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
           <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
           <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext  href=""/>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
          </div>       
    
      </div>

    </>
  );
};

export default DoctorsList;
