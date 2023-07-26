import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "@modules/users/entities/user.entity";
import { UserService } from "@modules/users/user.service";
import { CreateAccountInput, CreateAccountOutput } from "@modules/users/dtos/create-account.dto";
import { LoginInput, LoginOutput } from "@modules/users/dtos/login.dto";
import { AuthUser } from "@modules/auth/auth-user.decorator";
import { UserProfileInput, UserProfileOutput } from "@modules/users/dtos/user-profile.dto";
import { EditProfileInput, EditProfileOutput } from "@modules/users/dtos/edit-profile.dto";
import { VerifyEmailInput, VerifyEmailOutput } from "@modules/users/dtos/verify-email.dto";
import Roles from "@modules/auth/auth-roles.decorator";

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @Roles(["Any"])
  @Query((returns) => User)
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Roles(["Any"])
  @Query((returns) => UserProfileOutput)
  async userProfile(@Args() userProfileInputDto: UserProfileInput): Promise<UserProfileOutput> {
    const { ok, errorMsg, user } = await this.usersService.findById(userProfileInputDto.userId);
    return {
      ok,
      user,
      errorMsg,
    };
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

  @Roles(["Any"])
  @Mutation((returns) => EditProfileOutput)
  async editProfile(
    @AuthUser() authUser: User,
    @Args("input") editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    const { ok, errorMsg } = await this.usersService.editProfile(authUser.id, editProfileInput);
    return {
      ok,
      errorMsg,
    };
  }

  @Mutation((returns) => VerifyEmailOutput)
  async verifyEmail(@Args("input") { code }: VerifyEmailInput): Promise<VerifyEmailOutput> {
    const { ok, errorMsg } = await this.usersService.verifyEmail(code);
    return {
      ok,
      errorMsg,
    };
  }
}
