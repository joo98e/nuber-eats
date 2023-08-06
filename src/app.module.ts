import * as Joi from "joi";
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { User } from "@modules/users/entities/user.entity";
import { JwtModule } from "./jwt/jwt.module";
import { JwtMiddleware } from "@modules/jwt/jwt.middleware";
import { Verification } from "@modules/users/entities/verification.entity";
import { MailModule } from "./mail/mail.module";
import * as process from "process";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";
import { Category } from "@modules/restaurants/entities/category.entity";
import { RestaurantsModule } from "@modules/restaurants/restaurants.module";
import { AuthModule } from "@modules/auth/auth.module";
import { AuthUserKey } from "@modules/auth/auth-user.decorator";
import { TypeOrmExtendModule } from "@modules/common/typeorm/typeorm-extend.module";
import CategoryRepository from "@modules/restaurants/repositories/category.repository";

const isProd = process.env.NODE_ENV === "prod";
const isDev = process.env.NODE_ENV === "dev";
const isTest = process.env.NODE_ENV === "test";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: isDev ? ".env.dev" : ".env.test",
      ignoreEnvFile: isProd,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid("dev", "prod", "test").required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_FROM_EMAIL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: !isProd, // db push
      logging: isDev,
      entities: [User, Verification, Restaurant, Category],
    }),
    TypeOrmExtendModule.forCustomRepository([CategoryRepository]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloDriver,
      context: ({ req }) => ({
        user: req[AuthUserKey],
      }),
    }),
    UsersModule,
    JwtModule.register({
      privateKey: process.env.PRIVATE_KEY,
    }),
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN_NAME,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
    }),
    RestaurantsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: "/graphql",
      method: RequestMethod.POST,
    });
  }
}
