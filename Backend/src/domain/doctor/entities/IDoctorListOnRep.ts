export interface IDoctorListOnRep {
  id: string;
  name: string;
  hospital: string;
  image:string | null;
  departmentId: string | null;
  territoryId: string | null;
  departmentName?:string;
  territoryName?:string;
}
