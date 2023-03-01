import { UserService } from "@modules/users/user.service";
import { Test } from "@nestjs/testing";
import { Repository } from "typeorm";
import { User } from "@modules/users/entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Verification } from "@modules/users/entities/verification.entity";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@modules/jwt/jwt.service";

const mockRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

describe("userService Test", function () {
  let service: UserService;

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
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it("defined Test", function () {
    expect(service).toBeDefined();
  });
});
