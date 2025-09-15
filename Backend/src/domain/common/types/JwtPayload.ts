export interface JwtPayload {
  userId: string;
  role: string;
}

export interface RefreshTokenPayload extends JwtPayload {
  tokenVersion: number; 
}

