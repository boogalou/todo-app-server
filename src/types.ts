export type AuthResponse = {
  id: number;
  username: string;
  email: string;
  accessToken: string;
  refreshToken?: string;
};
