export interface Certificate {
  id: string;
  name: string;
  issuedBy: string;
  year: number;
}

export interface Education {
  id: string;
  degree: string;
  institute: string;
  year: number;
}

export interface MedicalRep {
  id: string;
  name: string;
  about: string;
  companyLogoUrl: string;
  companyName: string;
  email: string;
  employeeId: string;
  loginId: string;
  phone: string;
  profileImage: string;
  certificates: Certificate[];
  educations: Education[];
}

export interface Post {
  id: string;
  brand: string;
  createdAt: string;
  productImage: string;
  title: string;
  likes: number;
  interests: number;
}

export interface RepProfileData {
  medicalRep: MedicalRep;
  posts: Post[];
}
