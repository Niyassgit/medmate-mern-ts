export interface IDoctorListOnRep {
  id: string;
  name: string;
  hospital: string;
  departmentId: string | null;
  territoryId: string | null;
  departmentName?:string;
  territoryName?:string;
}
