import * as Joi from "joi";
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { User } from "@modules/users/entities/user.entity";
import { Verification } from "@modules/users/entities/verification.entity";
import { JwtModule } from "./jwt/jwt.module";
import { JwtMiddleware } from "@modules/jwt/jwt.middleware";

const isProd = process.env.NODE_ENV === "prod";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env.dev",
      ignoreEnvFile: isProd,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid("dev", "prod").required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
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
      logging: isProd,
      entities: [User, Verification],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloDriver,
      context: ({ req }) => ({
        user: req["user"],
      }),
    }),
    UsersModule,
    JwtModule.register({
      privateKey: process.env.PRIVATE_KEY,
    }),
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
