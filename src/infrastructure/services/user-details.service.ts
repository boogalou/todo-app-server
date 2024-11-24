import { UserDetails } from '../../shared/types';

export interface UserDetailsService {
  findById(id: number): Promise<UserDetails>;
}
