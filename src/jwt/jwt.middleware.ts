import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { JWT_HEADER_KEY, USER_ID_PROPERTY_KEY } from "@modules/jwt/jwt.constants";
import { JwtService } from "@modules/jwt/jwt.service";
import { UserService } from "@modules/users/user.service";
import { AuthUserKey } from "@modules/auth/auth-user.decorator";

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService, private readonly usersService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (JWT_HEADER_KEY in req.headers) {
      const token = req.headers[JWT_HEADER_KEY];
      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === "object" && decoded.hasOwnProperty(USER_ID_PROPERTY_KEY)) {
          const { ok, user } = await this.usersService.findById(decoded[USER_ID_PROPERTY_KEY]);
          if (ok) {
            req[AuthUserKey] = user;
          }
        }
      } catch (e) {
        throw new Error(`unknown user.`);
      }
    }

    next();
  }
}
