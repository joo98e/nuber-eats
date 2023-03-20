import { Inject, Injectable } from "@nestjs/common";
import { JwtModuleOptions, JwtSignObject, JwtTokenString } from "@modules/jwt/types/jwt-module-options.interface";
import * as jwt from "jsonwebtoken";
import { JWT_CONFIG_OPTIONS } from "@modules/jwt/jwt.constants";

@Injectable()
export class JwtService {
  constructor(@Inject(JWT_CONFIG_OPTIONS) private readonly options: JwtModuleOptions) {}

  sign(jwtSignObject: JwtSignObject): JwtTokenString {
    if (!("id" in jwtSignObject) || isNaN(jwtSignObject.id)) throw new Error();
    return jwt.sign(jwtSignObject, this.options.privateKey);
  }

  verify(token: JwtTokenString) {
    return jwt.verify(token, this.options.privateKey);
  }
}
