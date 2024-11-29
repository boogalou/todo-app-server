import { UserDetails } from '../../shared/types';

export interface UserDetailsService {
  getById(id: number): Promise<UserDetails>;
}
