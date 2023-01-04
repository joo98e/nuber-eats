import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "@modules/users/entities/user.entity";
import { UserService } from "@modules/users/user.service";
import { CreateAccountInput, CreateAccountOutput } from "@modules/users/dtos/create-account.dto";
import { LoginInput, LoginOutput } from "@modules/users/dtos/login.dto";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@modules/auth/auth.guard";
import { AuthUser } from "@modules/auth/auth-user.decorator";
import { UserProfileInput, UserProfileOutput } from "@modules/users/dtos/user-profile.dto";
import { EditProfileInput, EditProfileOutput } from "@modules/users/dtos/edit-profile.dto";
import { VerifyEmailInput, VerifyEmailOutput } from "@modules/users/dtos/verify-email.dto";

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

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

  @UseGuards(AuthGuard)
  @Mutation((returns) => EditProfileOutput)
  async editProfile(
    @AuthUser() authUser: User,
    @Args("input") editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      await this.usersService.editProfile(authUser.id, editProfileInput);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        errorMsg: "profile update is fail",
      };
    }
  }

  @Mutation((returns) => VerifyEmailOutput)
  async verifyEmail(@Args("input") verifyEmailInput: VerifyEmailInput): Promise<VerifyEmailOutput> {
    const booleanPromise = this.usersService.verifyEmail(verifyEmailInput.code);

    return {
      ok: false,
    };
  }
}
