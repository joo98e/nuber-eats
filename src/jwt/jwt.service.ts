import { Inject, Injectable } from "@nestjs/common";
import { JwtModuleOptions, JwtToken } from "@modules/jwt/types/jwt-module-options.interface";
import * as jwt from "jsonwebtoken";
import { JWT_CONFIG_OPTIONS } from "@modules/jwt/jwt.constants";

@Injectable()
export class JwtService {
  sign(payload: object): JwtToken {
    return jwt.sign(payload, this.options.privateKey);
  }

  constructor(@Inject(JWT_CONFIG_OPTIONS) private readonly options: JwtModuleOptions) {}
}
