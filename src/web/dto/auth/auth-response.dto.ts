export class AuthResponseDto {
  readonly id: number;
  readonly email: string;
  readonly username: string;
  readonly userPic: string | null;
  readonly accessToken: string;
}
