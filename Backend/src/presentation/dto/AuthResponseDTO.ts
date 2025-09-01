export interface AuthResponseDTO {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}
