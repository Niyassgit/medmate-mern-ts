export interface DoctorPreviewForGuestDTO {
  id: string;
  name: string;
  hospitalName: string;
  profileImage: string | null;
  about: string;
  createdAt: Date;
  dob: Date | null;
  departmentName: string | null;
  territoryName: string | null;
}
