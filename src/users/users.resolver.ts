import {
  Args,
  Mutation,
  Query,
  Resolver,
} from "@nestjs/graphql";
import { User } from "@modules/users/entities/users.entity";
import { UsersService } from "@modules/users/users.service";
import {
  CreateAccountInput,
  CreateAccountOutput,
} from "@modules/users/dtos/create-account.dto";

@Resolver((of) => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Query((returns) => Number)
  getUser() {
    return 1;
  }

  @Mutation((returns) => CreateAccountOutput)
  createAccount(
    @Args("input")
    createAccountInput: CreateAccountInput,
  ) {}
}
