import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@modules/users/entities/user.entity";
import { UserResolver } from "@modules/users/user.resolver";
import { UserService } from "@modules/users/user.service";
import { Verification } from "@modules/users/entities/verification.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UsersModule {}
