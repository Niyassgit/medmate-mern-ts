import { Outlet,NavLink } from "react-router-dom"
import { User,LayoutDashboard,UserCheck,ClipboardPlus,Handshake,MapPin,FilePen,Globe} from "lucide-react"
import { Avatar,AvatarImage,AvatarFallback } from "@/components/ui/avatar"


const AdminLayout = () => {
  
   return (
    <div className="flex h-screen">

      <aside className="flex flex-col justify-between w-64 bg-[#de3b40] text-white">
       
        <div className="p-2 flex items-center ">
        
            <img
              src="/logo.png"
              alt="MedMate Logo"
              className="w-auto h-12 object-contain"
            />
         <span className="text-xl font-bold italic">MedMate</span>
         </div>
   
          <nav className="flex-1 flex flex-col gap-3 p-4 bg-[#b9181d]">

            <ul className="space-y-2"> 
              <li>
                <NavLink to={"dashboard"}
                 className={({ isActive})=>`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive
                  ?"bg-gray-200 text-black font-semibold"
                  :"text-white hover:bg-[#a81519]"
                }`
                }> 
                  <LayoutDashboard className="w-5 h-5"/>
                 <span>Dashboard</span> 
                </NavLink>
              </li>

              <li className="space-y-2">
                 <NavLink to={"user-validation"} className={({isActive})=> `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                   isActive
                   ?"bg-gray-200 text-black font-semibold"
                   :"text-white hover:bg-[#a81519]"

                 }`
                 }>
                  <UserCheck className="w-5 h-5"/>
                  <span>User Validation</span> 
                 </NavLink>
                
              </li>
               
              <li className="space-y-2">
                 <NavLink to={"doctors-list"} className={({isActive})=> `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                   isActive
                   ?"bg-gray-200 text-black font-semibold"
                   :"text-white hover:bg-[#a81519]"
                 }`
                 
                 }>
                  <ClipboardPlus className="w-5 h-5"/>
                  <span>Doctors</span> 
                 </NavLink>
                
              </li>
              
                <li className="space-y-2">
                 <NavLink to={"reps-list"} className={({isActive})=>`flex items-center gap-2 px-3 py-2 ${
                  isActive
                  ?"bg-gray-200 text-black font-semibold"
                  :"text-white hover:bg-[#a81519]"
                 }`
                  }>
                  <Handshake className="w-5 h-5"/>
                  <span>Medical Reps</span> 
                 </NavLink>
                
                </li>

                <li className="space-y-2">
                 <NavLink to={"territory"} className={({isActive})=>`flex items-center gap-2 px-3 py-2 ${
                    isActive
                     ?"bg-gray-200 text-black font-semibold"
                     :"text-white hover:bg-[#a81519]"
                 }`
                 }>
                  <MapPin className="w-5 h-5"/>
                  <span>Territory Management</span> 
                 </NavLink>
                
                </li>

                  <li className="space-y-2">
                 <NavLink to={"territory"} className={({isActive})=>`flex items-center gap-2 px-3 py-2 ${
                    isActive
                     ?"bg-gray-200 text-black font-semibold"
                     :"text-white hover:bg-[#a81519]"
                 }`
                 }>
                  <FilePen className="w-5 h-5"/>
                  <span>Content Moderation </span> 
                 </NavLink>
                
                </li>

                  <li className="space-y-2">
                 <NavLink to={"department"} className={({isActive})=>`flex items-center gap-2 px-3 py-2 ${
                    isActive
                     ?"bg-gray-200 text-black font-semibold"
                     :"text-white hover:bg-[#a81519]"
                 }`
                 }>
                  <Globe className="w-5 h-5"/>
                  <span>Department </span> 
                 </NavLink>
                
                </li>


            </ul>

        </nav>

       <div className="p-2 flex items-center gap-3 border-t border-[#b9181d]">
  <Avatar>
    <AvatarImage src="/user-profile.jpg" alt="Admin" />
    <AvatarFallback>
      <User className="h-6 w-6" />
    </AvatarFallback>
  </Avatar>

  <div>
    <p className="font-semibold">Admin Name</p>
    <p className="text-sm text-gray-200">Admin</p>
  </div>
</div>


      </aside>

      <main className="flex-1 p-6 bg-gray-100">
        <Outlet/>
      </main>
    </div>
  )
};

export default AdminLayout
