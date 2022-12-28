import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@modules/users/entities/user.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CreateAccountInputDto } from "@modules/users/dtos/create-account.dto";
import { TryCatch } from "@modules/utils/decorator/catch.decorator";
import { LoginInputDto, LoginOutputDto } from "@modules/users/dtos/login.dto";
import { DefaultResponse } from "@modules/common/dtos/default.response";
import * as jwt from "jsonwebtoken";
import { JwtService } from "@modules/jwt/jwt.service";
import { ConfigService } from "@nestjs/config";

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

      const token = this.jwtService.sign({ id: user.id });

      return { ok: true, token };
    } catch (e) {
      return { ok: true, errorMsg: "unknown Error" };
    }
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
}
