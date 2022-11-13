import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@modules/users/entities/users.entity";
import { UsersResolver } from "@modules/users/users.resolver";
import { UsersService } from "@modules/users/users.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
