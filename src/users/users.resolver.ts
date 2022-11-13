import { Query, Resolver } from "@nestjs/graphql";
import { User } from "@modules/users/entities/users.entity";
import { UsersService } from "@modules/users/users.service";

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Number)
  getOne() {
    return 1;
  }
}
