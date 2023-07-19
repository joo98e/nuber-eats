import { INestApplication } from "@nestjs/common";
import { AppModule } from "@modules/app.module";
import { Test } from "@nestjs/testing";
import { DataSource, Repository } from "typeorm";
import * as request from "supertest";
import { LoginOutput } from "@modules/users/dtos/login.dto";
import { CreateAccountOutput } from "@modules/users/dtos/create-account.dto";
import { User } from "@modules/users/entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserProfileOutput } from "@modules/users/dtos/user-profile.dto";
import { JWT_HEADER_KEY } from "@modules/jwt/jwt.constants";
import { Verification } from "@modules/users/entities/verification.entity";
import { VerifyEmailOutput } from "@modules/users/dtos/verify-email.dto";

jest.mock("got", () => {
  return {
    post: jest.fn(),
  };
});

const GRAPHQL_ENDPOINT = "/graphql" as const;

describe("UserModule (e2e)", () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let verificationRepository: Repository<Verification>;
  let jwtToken: string;

  function _request() {
    return request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
  }

  function publicRequest(query: string) {
    return _request().send({ query });
  }

  function privateRequest(query: string) {
    return _request().set(JWT_HEADER_KEY, jwtToken).send({ query });
  }

  const testUser = {
    email: "joo98e@gmail.com",
    password: "12345",
    role: "OWNER",
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    userRepository = module.get(getRepositoryToken(User));
    verificationRepository = module.get(getRepositoryToken(Verification));
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
      return publicRequest(`
          mutation{
            createAccount(input :{
              email: "${testUser.email}",
              password : "${testUser.password}",
              role: ${testUser.role}
            }){
              ok,
              errorMsg
            }
          }
        `)
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
      return publicRequest(`
          mutation{
            login(
              input:{
                email :"${testUser.email}",
                password :"${testUser.password}"
              }
            ){
              ok
              errorMsg
              token
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const loginOutput: LoginOutput = res.body.data.login;

          expect(loginOutput.ok).toBeTruthy();
          expect(loginOutput.errorMsg).toBe(null);
          expect(loginOutput.token).toEqual(expect.any(String));

          jwtToken = loginOutput.token;
        });
    });

    it("incorrect id and password", () => {
      return publicRequest(`
          mutation{
            login(
              input:{
                email :"${testUser.email}",
                password :"incorrect_password",
              }
            ){
              ok
              errorMsg
              token
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const loginOutput: LoginOutput = res.body.data.login;

          expect(loginOutput.ok).toBeFalsy();
          expect(loginOutput.errorMsg).toBe("Password is incorrect.");
          expect(loginOutput.token).toEqual(null);
        });
    });
  });

  describe("userProfile", () => {
    let firstUserId: number;

    beforeAll(async () => {
      const [firstUser] = await userRepository.find();
      firstUserId = firstUser.id;
    });

    it("should See a User Profile", () => {
      return privateRequest(`
          query {
            userProfile(userId:${firstUserId}) {
              ok
              errorMsg
              user {
                id,
              }
            }
          }`)
        .expect(200)
        .expect((res) => {
          const userProfileOutput: UserProfileOutput = res.body?.data?.userProfile;
          expect(userProfileOutput.ok).toBeTruthy();
          expect(userProfileOutput.user.id).toBe(firstUserId);
        });
    });

    it("The User Profile should not be found", () => {
      return privateRequest(`
          query {
            userProfile(userId: 666) {
              ok
              errorMsg
              user {
                id,
              }
            }
          }`)
        .expect(200)
        .expect((res) => {
          const userProfileOutput: UserProfileOutput = res.body?.data?.userProfile;
          expect(userProfileOutput.ok).toBeFalsy();
          expect(userProfileOutput.user).toBe(null);
        });
    });
  });

  describe("me", () => {
    it("should be failed find the Profile", () => {
      return publicRequest(`
            query {
              me{
                email
              }
            }
        `)
        .expect(200)
        .expect((res) => {
          const errors = res.body.errors;
          expect(Boolean(errors)).toBeTruthy();
        });
    });
  });

  describe("editProfile", () => {
    const newAnythingElseEmail = `joo98e3@gmail.com`;
    it("should be possible change the email", () => {
      return privateRequest(`
          mutation {
            editProfile (
              input :{
                email : "${newAnythingElseEmail}"
              }
            ){
             ok 
            }
          }
          `)
        .expect(200)
        .expect((res) => {
          const data = res.body.data.editProfile;
          expect(data.ok).toBeTruthy();
        });
    });

    it("should have been Changed to the new anything else email.", () => {
      return privateRequest(`
          query {
            me{
              email
            }
          }
      `)
        .expect(200)
        .expect((res) => {
          const me: User = res.body.data.me;
          expect(me.email).toBe(newAnythingElseEmail);
        });
    });
  });

  describe("verifyEmail", () => {
    let verifyCode: string = "";
    beforeAll(async () => {
      const [verification] = await verificationRepository.find();
      verifyCode = verification.code;
    });

    it("should be success when input the correct verify Code", () => {
      return privateRequest(`
        mutation {
            verifyEmail(
              input :{
                code :"${verifyCode}"
              }
            ){
              ok
            }
          }
      `)
        .expect(200)
        .expect((res) => {
          const { ok } = res.body.data.verifyEmail;
          expect(ok).toBeTruthy();
        });
    });

    it("should be failed when input the incorrect verify Code", () => {
      return privateRequest(`
        mutation {
            verifyEmail(
              input :{
                code :"wrong Verification Code"
              }
            ){
              ok,
              errorMsg
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const { ok, errorMsg }: VerifyEmailOutput = res.body.data.verifyEmail;
          expect(ok).toBeFalsy();
          expect(errorMsg).toBe("Could not find the email verification record.");
        });
    });
  });
});
