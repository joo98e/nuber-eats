import { UserService } from "@modules/users/user.service";
import { Test } from "@nestjs/testing";
import { User } from "@modules/users/entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Verification } from "@modules/users/entities/verification.entity";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@modules/jwt/jwt.service";
import { MailService } from "@modules/mail/mail.service";

const mockRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
};

describe("userService Test", function () {
  let service: UserService;
  let userRepository: MockRepository<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it("defined Test", function () {
    expect(service).toBeDefined();
  });

  it.todo("create Account");

  describe("create Account", () => {
    it("should fail if user exist", () => {});
  });

  it.todo("login");
  it.todo("findById");
  it.todo("editProfile");
  it.todo("mail Verification");
});
