import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/UserEntity';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
