import { JwtService } from "@modules/jwt/jwt.service";
import { Test } from "@nestjs/testing";
import { JWT_CONFIG_OPTIONS } from "@modules/jwt/jwt.constants";

describe("JwtService ", () => {
  let service: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: JWT_CONFIG_OPTIONS,
          useValue: { privateKey: "testKey" },
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
