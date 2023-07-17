import { INestApplication } from "@nestjs/common";
import { AppModule } from "@modules/app.module";
import { Test } from "@nestjs/testing";
import { DataSource } from "typeorm";
import * as request from "supertest";
import { LoginOutput } from "@modules/users/dtos/login.dto";
import { CreateAccountOutput } from "@modules/users/dtos/create-account.dto";

jest.mock("got", () => {
  return {
    post: jest.fn(),
  };
});

const GRAPHQL_ENDPOINT = "/graphql" as const;

describe("UserModule (e2e)", () => {
  let app: INestApplication;

  const USER_EMAIL = `"joo98e@gmail.com"`;
  const USER_PASSWORD = `"12345"`;
  const USER_ROLE = `OWNER`;
  let jwtToken: string;

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
          const createAccountOutput: CreateAccountOutput = res.body.data.createAccount;

          expect(createAccountOutput.ok).toBeTruthy();
          expect(createAccountOutput.errorMsg).toBeNull();
        });
    });
  });

  describe("login", () => {
    it("correct id and password", () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation{
            login(
              input:{
                email :${USER_EMAIL},
                password :${USER_PASSWORD}
              }
            ){
              ok
              errorMsg
              token
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          const loginOutput: LoginOutput = res.body.data.login;

          expect(loginOutput.ok).toBeTruthy();
          expect(loginOutput.errorMsg).toBe(null);
          expect(loginOutput.token).toEqual(expect.any(String));
        });
    });

    it("incorrect id and password", () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation{
            login(
              input:{
                email :${USER_EMAIL},
                password :"incorrect_password",
              }
            ){
              ok
              errorMsg
              token
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          const loginOutput: LoginOutput = res.body.data.login;

          expect(loginOutput.ok).toBeFalsy();
          expect(loginOutput.errorMsg).toBe("Password is incorrect.");
          expect(loginOutput.token).toEqual(null);

          jwtToken = loginOutput.token;
        });
    });
  });

  it.todo("userProfile");
  it.todo("me");
  it.todo("verifyEmail");
  it.todo("editProfile");
});
