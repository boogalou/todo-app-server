import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/User.entity';
import { JwtModule } from '../jwt/jwt.module';
import { UserRepository } from './user.repository';
import { UserSettingsModule } from '../user-settings/user-settings.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule, UserSettingsModule],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule {}
