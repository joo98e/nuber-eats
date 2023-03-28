import { INestApplication } from "@nestjs/common";
import { AppModule } from "@modules/app.module";
import { Test } from "@nestjs/testing";
import { DataSource } from "typeorm";
import * as request from "supertest";

const GRAPHQL_ENDPOINT = "/graphql" as const;

describe("UserModule (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    const dataSource = new DataSource({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],
      synchronize: true,
    });
    const connection = await dataSource.initialize();
    await connection.dropDatabase();
    await connection.destroy();
    void app.close();
  });

  describe("createAccount", () => {
    it("should create account", async () => {
      const USER_EMAIL = `"joo98e@gmail.com"`;
      const USER_PASSWORD = `"12345"`;
      const USER_ROLE = `OWNER`;

      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation{
            createAccount(input :{
              email: ${USER_EMAIL},
              password : ${USER_PASSWORD},
              role : ${USER_ROLE}
            }){
              ok,
              errorMsg
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBeTruthy();
          expect(res.body.data.createAccount.errorMsg).toBeNull();
        });
    });
  });

  it.todo("userProfile");
  it.todo("login");
  it.todo("me");
  it.todo("verifyEmail");
  it.todo("editProfile");
});
