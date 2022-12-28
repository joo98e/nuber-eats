import { DynamicModule, Global, Module } from "@nestjs/common";
import { JwtService } from "./jwt.service";
import { JwtModuleOptions } from "@modules/jwt/types/jwt-module-options.interface";
import { UserService } from "@modules/users/user.service";

@Module({})
@Global()
export class JwtModule {
  static register(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      providers: [
        JwtService,
        {
          provide: "JWT_MO_OPTIONS",
          useValue: options,
        },
      ],
      exports: [JwtService],
    };
  }
}
