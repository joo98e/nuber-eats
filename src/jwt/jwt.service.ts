import { Inject, Injectable } from "@nestjs/common";
import { JwtModuleOptions } from "@modules/jwt/types/jwt-module-options.interface";

@Injectable()
export class JwtService {
  constructor(@Inject("JWT_MO_OPTIONS") private readonly options: JwtModuleOptions) {
    console.log(options);
  }
}
