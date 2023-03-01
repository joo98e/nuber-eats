import { UserService } from "@modules/users/user.service";
import { Test } from "@nestjs/testing";
import { User } from "@modules/users/entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Verification } from "@modules/users/entities/verification.entity";
import { JwtService } from "@modules/jwt/jwt.service";
import { MailService } from "@modules/mail/mail.service";

const generateMockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

// create Mock Service
const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
};

describe("userService Test", function () {
  let userService: UserService;
  let jwtService: JwtService;
  let mailService: MailService;
  let userRepository: MockRepository<User>;
  let verificationRepository: MockRepository<Verification>;

  const ANONYMOUS_CODE = expect.any(String);
  const createAccountArgs = {
    email: "blabla@bla.com",
    password: "password",
    role: 0,
  };
  const verifyReturnValue = {
    user: createAccountArgs,
    code: ANONYMOUS_CODE,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: generateMockRepository(),
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: generateMockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    mailService = module.get<MailService>(MailService);
    userRepository = module.get(getRepositoryToken(User));
    verificationRepository = module.get(getRepositoryToken(Verification));
  });

  it("defined Test", function () {
    expect(userService).toBeDefined();
  });

  describe("create Account", () => {
    it("should fail if user exist", async () => {
      userRepository.findOne.mockResolvedValue(User);

      const coreOutputPromise = await userService.createAccount(createAccountArgs);

      expect(coreOutputPromise).toMatchObject({
        ok: false,
        errorMsg: "There is User with that email already.",
      });
    });

    it("should create User", async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      userRepository.create.mockReturnValue(createAccountArgs);
      userRepository.save.mockReturnValue(createAccountArgs);

      verificationRepository.create.mockReturnValue(verifyReturnValue);
      verificationRepository.save.mockReturnValue(verifyReturnValue);

      const result = await userService.createAccount(createAccountArgs);

      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(createAccountArgs);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(createAccountArgs);
      expect(userRepository.save).toHaveReturnedWith(createAccountArgs);

      expect(verificationRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationRepository.create).toHaveBeenCalledWith({
        user: createAccountArgs,
      });
      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledWith({
        user: createAccountArgs,
        code: ANONYMOUS_CODE,
      });

      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(createAccountArgs.email, ANONYMOUS_CODE);

      expect(result).toHaveProperty("ok");
      expect(result).toStrictEqual({
        ok: true,
      });
    });
  });

  it.todo("login");
  it.todo("findById");
  it.todo("editProfile");
  it.todo("mail Verification");
});
