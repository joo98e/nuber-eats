import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "@modules/users/entities/user.entity";
import { UserService } from "@modules/users/user.service";
import { CreateAccountInputDto, CreateAccountOutputDto } from "@modules/users/dtos/create-account.dto";
import { LoginInputDto, LoginOutputDto } from "@modules/users/dtos/login.dto";

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @Query((returns) => Number)
  getUser() {
    return 1;
  }

  @Query((returns) => User)
  me() {}

  @Mutation((returns) => CreateAccountOutputDto)
  async createAccount(
    @Args("input")
    createAccountInput: CreateAccountInputDto,
  ): Promise<CreateAccountOutputDto> {
    const { ok, errorMsg } = await this.usersService.createAccount(createAccountInput);
    return { ok, errorMsg };
  }

  @Mutation((returns) => LoginOutputDto)
  async login(@Args("input") loginInput: LoginInputDto): Promise<LoginOutputDto> {
    const { ok, errorMsg, token } = await this.usersService.login(loginInput);
    return { ok, errorMsg, token };
  }
}
