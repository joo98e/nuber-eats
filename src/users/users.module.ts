import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@modules/users/entities/user.entity";
import { UserResolver } from "@modules/users/user.resolver";
import { UserService } from "@modules/users/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UsersModule {}
