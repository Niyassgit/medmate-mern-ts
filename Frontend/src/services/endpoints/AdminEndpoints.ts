export const AdminEndpoints= {
  GET_DOCTORS :(page:number,limit:number,search:string="")=> `/admin/doctors?page=${page}&limit=${limit}&search=${search}`,
  GET_REPS : (page:number,limit:number,search:string="")=>`/admin/reps?page=${page}&limit=${limit}&search=${search}`,
  BLOCK_USER : (userId: string) => `/admin/block/${userId}`,
  UNBLOCK_USER : (userId: string) => `/admin/unblock/${userId}`,
  DOCTOR_DETAILS:(userId:string)=>`/admin/doctors/${userId}`,
  REP_DETAILS:(userId:string)=>`/admin/reps/${userId}`
}
