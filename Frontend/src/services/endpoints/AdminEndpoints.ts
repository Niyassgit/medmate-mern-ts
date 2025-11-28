export const AdminEndpoints= {
  GET_DOCTORS :(page:number,limit:number,search:string="")=> `/admin/doctors?page=${page}&limit=${limit}&search=${search}`,
  GET_REPS : (page:number,limit:number,search:string="")=>`/admin/reps?page=${page}&limit=${limit}&search=${search}`,
  BLOCK_USER : (userId: string) => `/admin/block/${userId}`,
  UNBLOCK_USER : (userId: string) => `/admin/unblock/${userId}`,
  DOCTOR_DETAILS:(userId:string)=>`/admin/doctors/${userId}`,
  REP_DETAILS:(userId:string)=>`/admin/reps/${userId}`,
  GET_TERRITORIES:(userId:string,page:number,limit:number,search:string)=>`/admin/territories/${userId}?page=${page}&limit=${limit}&search=${search}`,
  ADD_TERRITORY:`/admin/territories/create`,
  EDIT_TERRITORY:(territoryId:string)=>`/admin/territories/edit/${territoryId}`,
  GET_DEPARTMENTS:(userId:string,page:number,limit:number,search:string)=>`/admin/departments/${userId}?page=${page}&limit=${limit}&search=${search}`,
  CREATE_DEPARTMENT:`/admin/departments/create`,
  EDIT_DEPARTMENTS:(departmentId:string)=>`/admin/departments/edit/${departmentId}`
}
