import * as jwt from "jsonwebtoken";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@modules/users/entities/users.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CreateAccountInputDto } from "@modules/users/dtos/create-account.dto";
import { TryCatch } from "@modules/utils/decorator/catch.decorator";
import { LoginInputDto, LoginOutputDto } from "@modules/users/dtos/login.dto";
import { DefaultOutputDto } from "@modules/common/dtos/default-output.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  getOne() {
    return 1;
  }

  @TryCatch("Could not create Account.")
  async createAccount({ email, password, role }: CreateAccountInputDto): Promise<DefaultOutputDto> {
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

    await this.userRepository.save(
      this.userRepository.create({
        email,
        password,
        role,
      }),
    );

    return { ok: true };
  }

  @TryCatch("Could not login with your email or password.")
  async login({ email, password }: LoginInputDto): Promise<LoginOutputDto> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return { ok: false, errorMsg: "User not found." };

    const passwordCorrect = await user.comparePassword(password);
    if (!passwordCorrect) return { ok: false, errorMsg: "Password is incorrect." };

    const token = jwt.sign(
      {
        id: user.id,
        createAt: user.createAt,
      },
      this.configService.get("SECRET_JWT_KEY"),
      { algorithm: "RS256" },
    );

    return { ok: true, errorMsg: "", token: "" };
  }
}
