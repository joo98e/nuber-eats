import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@modules/users/entities/user.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CreateAccountInput } from "@modules/users/dtos/create-account.dto";
import { TryCatch } from "@modules/utils/decorator/catch.decorator";
import { LoginInput, LoginOutput } from "@modules/users/dtos/login.dto";
import { CoreOutput } from "@modules/common/dtos/coreOutput";
import { JwtService } from "@modules/jwt/jwt.service";
import { EditProfileInput, EditProfileOutput } from "@modules/users/dtos/edit-profile.dto";
import { Verification } from "@modules/users/entities/verification.entity";
import { VerifyEmailOutput } from "@modules/users/dtos/verify-email.dto";
import { UserProfileOutput } from "@modules/users/dtos/user-profile.dto";
import { MailService } from "@modules/mail/mail.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  @TryCatch("Could not create Account.")
  async createAccount({ email, password, role }: CreateAccountInput): Promise<CoreOutput> {
    const exists = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (exists) {
      return {
        ok: false,
        errorMsg: "There is User with that email already.",
      };
    }

    const user = await this.userRepository.save(
      this.userRepository.create({
        email,
        password,
        role,
      }),
    );

    const verification = await this.verificationRepository.save(
      this.verificationRepository.create({
        user,
      }),
    );

    this.mailService.sendVerificationEmail(user.email, verification.code);
    return { ok: true };
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.userRepository.findOne({ select: ["id", "password"], where: { email } });
      if (!user) {
        return { ok: false, errorMsg: "User not found." };
      }

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) return { ok: false, errorMsg: "Password is incorrect." };

      const token = this.jwtService.sign({ id: user.id });

      return { ok: true, errorMsg: null, token };
    } catch (e) {
      return { ok: false, errorMsg: "unknown Error" };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.userRepository.findOneOrFail({ where: { id } });

      return {
        ok: true,
        user,
      };
    } catch (e) {
      return {
        ok: false,
        errorMsg: "User not found.",
      };
    }
  }

  // user.update 반환 타입 : Promise<UpdateResult>
  // update 는 entity 의 존재 여부와 상관 없이 쿼리만 보낸다.
  // 그래서, BeforeInsert, BeforeUpdate 등의 hook 호출이 되지 않는다.
  // update 는 javascript 로 쿼리를 보내는 것이 아니며 정말 단지 쿼리만 보낸다.
  @TryCatch("AN_ERROR_HAS_OCCURRED")
  async editProfile(userId: number, editProfileInput: EditProfileInput): Promise<EditProfileOutput> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (editProfileInput.email) {
      user.email = editProfileInput.email;
      user.verified = false;
      await this.verificationRepository.save(this.verificationRepository.create({ user }));
    }

    if (editProfileInput.password) {
      user.password = editProfileInput.password;
    }

    await this.userRepository.save(user);

    return {
      ok: true,
    };
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verificationRepository.findOne({
        where: { code },
        relations: ["user"],
      });

      if (verification) {
        verification.user.verified = true;

        await this.userRepository.save(verification.user);
        await this.verificationRepository.delete(verification.id);

        return {
          ok: true,
        };
      }
    } catch (e) {
      return { ok: false, errorMsg: e };
    }
  }
}
