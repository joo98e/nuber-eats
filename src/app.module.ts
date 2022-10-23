import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { RestaurantsModule } from "@modules/restaurants/restaurants.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: false,
      encoding: "utf8",
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.test",
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "joo98e",
      password: "로컬 호스트로 연결 시 비밀번호를 검증하지 않는다. 12345",
      database: "nuber-eats",
      synchronize: true,
      logging: true,
      // entities: [3000, Category],
      // subscribers: [],
      // migrations: [],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloDriver,
    }),
    RestaurantsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
