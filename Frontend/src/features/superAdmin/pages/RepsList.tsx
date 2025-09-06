import AdminNavbar from "@/components/navbar/AdminNavbar";
import { Button } from "@/components/ui/button";
import useFetchList from "@/hooks/useFetchList";
import { getAllReps,blockUser,unblockUser } from "../api/superAdminApi";
import { useState } from "react";


interface MedicalRep {
  id: string;
  name: string;
  email: string;
  phone: string;
  subscriptionStatus: boolean;
  isBlocked: boolean;
  employeeId: string;
  createdAt: Date;
  loginId:string;
}

const RepsList = () => {
  const { data: reps, loading, error,setData} = useFetchList<MedicalRep>(getAllReps);
  const [blockLoading,setBlockLoading]=useState<string|null>(null);

  const handleBlockToggle=async(rep:MedicalRep)=>{
    
    try {
      setBlockLoading(rep.loginId);
      
      let userUpdated;
      if(rep.isBlocked){
        const res=await unblockUser(rep.loginId);
        userUpdated=res.updatedUser;
      }else{
        const res=await blockUser(rep.loginId);
        userUpdated=res.updatedUser;
      }
    
      setData((prev)=>(
        prev.map((doc)=>doc.loginId===rep.loginId?{...doc,isBlocked:userUpdated.isBlocked}:doc)
      ))
      
    } catch (error) {
      console.log("Block user Toggel error:",error);
      alert("Something went wronn on updating block status");
    }finally{
        setBlockLoading(null);
      }


  }

  return (
    <>
      <AdminNavbar />
      <div className="h-screen bg-gray-50 p-4">
        <span className="font-bold text-2xl text-gray-600">
          Medical Reps Management
        </span>

        <div className="p-6 bg-white rounded-xl shadow-md mt-3 ">
          <h2 className="text-xl font-semibold mb-4">Registered Reps</h2>

          {loading ? (
            <p className="text-gray-500">Loading reps....</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-medium">
                  <th className="p-3">Name</th>
                  <th className="p-3">email</th>
                  <th className="p-3">phone</th>
                  <th className="p-3">Employee Id</th>
                  <th className="p-3">Subscription Status</th>
                  <th className="p-3">Registeration Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {reps.map((rep) => (
                  <tr key={rep.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{rep.name}</td>
                    <td className="p-3">{rep.email}</td>
                    <td className="p-3">{rep.phone}</td>
                    <td className="p-3">{rep.employeeId}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rep.subscriptionStatus
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {rep.subscriptionStatus ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(rep.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rep.isBlocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {rep.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className="p-3 flex justify-center gap-2">
                      <Button
                      variant="outline"
                      size="sm"
                      >View</Button>
                      <Button 
                      variant={rep.isBlocked ? "default":"destructive"}
                      size="sm"
                      onClick={()=>handleBlockToggle(rep)}
                      disabled={blockLoading===rep.loginId}
                      >
                        {rep.isBlocked?"Unblock":"Block"}
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

export default RepsList;
