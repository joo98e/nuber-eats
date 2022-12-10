import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@modules/users/entities/users.entity";
import { UserResolver } from "@modules/users/userResolver";
import { UserService } from "@modules/users/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserResolver, UserService],
})
export class UsersModule {}
