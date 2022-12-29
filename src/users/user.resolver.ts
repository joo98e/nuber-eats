import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "@modules/users/entities/user.entity";
import { UserService } from "@modules/users/user.service";
import { CreateAccountInput, CreateAccountOutput } from "@modules/users/dtos/create-account.dto";
import { LoginInput, LoginOutput } from "@modules/users/dtos/login.dto";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@modules/auth/auth.guard";
import { AuthUser } from "@modules/auth/auth-user.decorator";
import { UserProfileInput, UserProfileOutput } from "@modules/users/dtos/user-profile.dto";

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @Query((returns) => Number)
  getUser() {
    return 1;
  }

  @Query((returns) => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @UseGuards(AuthGuard)
  @Query((returns) => UserProfileOutput)
  async userProfile(@Args() userProfileInputDto: UserProfileInput): Promise<UserProfileOutput> {
    try {
      const user = await this.usersService.findById(userProfileInputDto.userId);

      if (!user) {
        throw Error();
      }

      return {
        ok: true,
        user,
      };
    } catch (e) {
      return {
        ok: false,
        errorMsg: "user is not exist or not found.",
      };
    }
  }

  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Args("input")
    createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    const { ok, errorMsg } = await this.usersService.createAccount(createAccountInput);
    return { ok, errorMsg };
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args("input") loginInput: LoginInput): Promise<LoginOutput> {
    const { ok, errorMsg, token } = await this.usersService.login(loginInput);
    return { ok, errorMsg, token };
  }
}
