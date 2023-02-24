import { UserService } from "@modules/users/user.service";
import { Test } from "@nestjs/testing";

describe("userService Test", function () {
  let service: UserService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it("defined Test", function () {
    expect(service).toBeDefined();
  });
});
