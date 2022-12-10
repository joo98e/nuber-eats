import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@modules/users/entities/users.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CreateAccountInputDto } from "@modules/users/dtos/create-account.dto";
import { TryCatch } from "@modules/utils/decorator/catch.decorator";
import { LoginInputDto, LoginOutputDto } from "@modules/users/dtos/login.dto";
import { DefaultResponse } from "@modules/common/dtos/default.response";
import { ConfigService } from "@nestjs/config";
import * as jwt from "jsonwebtoken";
import { JwtService } from "@modules/jwt/jwt.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @TryCatch("Could not create Account.")
  async createAccount({ email, password, role }: CreateAccountInputDto): Promise<DefaultResponse> {
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

  async login({ email, password }: LoginInputDto): Promise<LoginOutputDto> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        return { ok: false, errorMsg: "User not found." };
      }

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) return { ok: false, errorMsg: "Password is incorrect." };

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        this.configService.get("SECRET_KEY"),
      );

      return { ok: true, token };
    } catch (e) {
      return { ok: true, errorMsg: "unknown Error" };
    }
  }
}