import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@modules/users/entities/user.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CreateAccountInput } from "@modules/users/dtos/create-account.dto";
import { TryCatch } from "@modules/utils/decorator/catch.decorator";
import { LoginInput, LoginOutput } from "@modules/users/dtos/login.dto";
import { CoreOutput } from "@modules/common/dtos/coreOutput";
import { JwtService } from "@modules/jwt/jwt.service";
import { ConfigService } from "@nestjs/config";
import { EditProfileInput } from "@modules/users/dtos/edit-profile.dto";
import { Verification } from "@modules/users/entities/verification.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
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

    await this.verificationRepository.save(
      this.verificationRepository.create({
        user,
      }),
    );

    return { ok: true };
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        return { ok: false, errorMsg: "User not found." };
      }

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) return { ok: false, errorMsg: "Password is incorrect." };

      const token = this.jwtService.sign({ id: user.id });

      return { ok: true, token };
    } catch (e) {
      return { ok: true, errorMsg: "unknown Error" };
    }
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  // user.update 반환 타입 : Promise<UpdateResult>
  // update 는 entity 의 존재 여부와 상관 없이 쿼리만 보낸다.
  // 그래서, BeforeInsert, BeforeUpdate 등의 hook 호출이 되지 않는다.
  // update 는 javascript 로 쿼리를 보내는 것이 아니며 정말 단지 쿼리만 보낸다.
  async editProfile(userId: number, editProfileInput: EditProfileInput): Promise<User> {
    console.log(editProfileInput);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (editProfileInput.email) {
      user.email = editProfileInput.email;
      user.verified = false;
      await this.verificationRepository.save(this.verificationRepository.create({ user }));
    }

    if (editProfileInput.password) {
      user.password = editProfileInput.password;
    }

    return await this.userRepository.save(user);
  }

  async verifyEmail(code: string): Promise<Boolean> {
    const verification = await this.verificationRepository.findOne({
      where: { code },
      relations: ["user"],
    });
    if (verification) {
      console.log(verification, verification.user);
    }

    return false;
  }
}
