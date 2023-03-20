import { JwtService } from "@modules/jwt/jwt.service";
import { Test } from "@nestjs/testing";
import { JWT_CONFIG_OPTIONS } from "@modules/jwt/jwt.constants";
import * as jwt from "jsonwebtoken";

const TEST_PRIVATE_KEY = "testKey" as const;
const USER_ID = 1;
const TEST_TOKEN = "TOKEN";
const DECODED_INFO = {
  id: USER_ID,
};

jest.mock("jsonwebtoken", () => {
  return {
    sign: jest.fn(() => TEST_TOKEN),
    verify: jest.fn(() => DECODED_INFO),
  };
});

describe("JwtService ", () => {
  let service: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: JWT_CONFIG_OPTIONS,
          useValue: { privateKey: TEST_PRIVATE_KEY },
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it.todo("sign");
  describe("Sign", () => {
    it("should return a signed token", () => {
      const signParams = { id: USER_ID };
      const token = service.sign(signParams);

      expect(typeof token).toBe("string");
      expect(jwt.sign).toHaveBeenCalledTimes(USER_ID);
      expect(jwt.sign).toHaveBeenCalledWith(signParams, TEST_PRIVATE_KEY);
    });
  });

  describe("Verify", () => {
    it("should return teh decoded token", () => {
      const decodedToken = service.verify(TEST_TOKEN);
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(jwt.verify).toHaveBeenCalledWith(TEST_TOKEN, TEST_PRIVATE_KEY);
      expect(decodedToken).toEqual(DECODED_INFO);
    });
  });
});
