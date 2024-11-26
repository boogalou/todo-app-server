import { Module } from '@nestjs/common';
import { UserServiceImpl } from '../../application/services/impl/user.service.impl';
import { UserController } from '../../web/controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { UserRepositoryImpl } from '../repositories/user.repository.impl';
import { UserMapperImpl } from '../../web/mappers/user/user-mapper.impl';
import {
  User_Details_Service,
  User_Mapper,
  User_Repository,
  User_Service,
} from '../../shared/tokens';
import { UserDetailsServiceImpl } from '../services/impl/user-details.service.impl';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    {
      provide: User_Service,
      useClass: UserServiceImpl,
    },
    {
      provide: User_Details_Service,
      useClass: UserDetailsServiceImpl,
    },
    {
      provide: User_Repository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: User_Mapper,
      useClass: UserMapperImpl,
    },
  ],
  controllers: [UserController],
  exports: [User_Service, User_Repository, User_Mapper, User_Details_Service],
})
export default class UserModule {}
