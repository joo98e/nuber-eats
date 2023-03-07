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
  findOneOrFail: jest.fn(),
});

// create Mock Service
const SIGNED_TOKEN = "signed-token";
const mockJwtService = {
  sign: jest.fn().mockImplementation((object) => SIGNED_TOKEN),
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

  const MOCK_EMAIL = "blabla@bla.com" as const;
  const MOCK_PASSWORD = "password" as const;
  const ANONYMOUS_CODE = expect.any(String);

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
    const createAccountArgs = {
      email: MOCK_EMAIL,
      password: MOCK_PASSWORD,
      role: 0,
    };
    const verifyReturnValue = {
      user: createAccountArgs,
      code: ANONYMOUS_CODE,
    };

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

    it("should fail on Exception", async () => {
      userRepository.findOne.mockRejectedValue(new Error());

      const result = await userService.createAccount(createAccountArgs);
      expect(result).toStrictEqual({
        ok: false,
        error: "Could not create Account.",
      });
    });
  });

  describe("login", () => {
    const loginUserArgs = {
      email: MOCK_EMAIL,
      password: MOCK_PASSWORD,
    };

    it("should fail if user does not exist", async () => {
      userRepository.findOne.mockReturnValue(undefined);

      const result = await userService.login(loginUserArgs);

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toStrictEqual({ ok: false, errorMsg: "User not found." });
    });

    it("should fail if the password is wrong", async () => {
      const mockedUser: Partial<User> = {
        password: MOCK_PASSWORD,
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };

      userRepository.findOne.mockResolvedValue(mockedUser);

      const result = await userService.login(loginUserArgs);

      expect(mockedUser.checkPassword).toHaveBeenCalledTimes(1);
      expect(mockedUser.checkPassword).toHaveBeenCalledWith(mockedUser.password);
      expect(result).toStrictEqual({ ok: false, errorMsg: "Password is incorrect." });
    });

    it("should return token if password correct", async () => {
      const mockedUser: Partial<User> = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };

      userRepository.findOne.mockResolvedValue(mockedUser);

      const result = await userService.login(loginUserArgs);

      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveReturnedWith(SIGNED_TOKEN);
    });

    it("should fail if the password is wrong", async function () {
      const mockedUser: Partial<User> = {
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };

      userRepository.findOne.mockResolvedValue(mockedUser);
      const result = await userService.login(loginUserArgs);
      expect(result).toEqual({ ok: false, errorMsg: "Password is incorrect." });
    });

    it("should return token if password correct", async function () {
      const mockedUser: Partial<User> = {
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };

      userRepository.findOne.mockResolvedValue(mockedUser);
      const result = await userService.login(loginUserArgs);
      expect(result).toEqual({ ok: true, token: SIGNED_TOKEN });
    });
  });

  describe("findById", () => {
    const findByIdArgs = { id: 1 };

    it("should find an existing user", async () => {
      userRepository.findOneOrFail.mockResolvedValue(findByIdArgs);
      const result = await userService.findById(1);
      expect(userRepository.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ok: true, user: findByIdArgs });
    });

    it("should fail if no user if found", async () => {
      userRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await userService.findById(1);
      expect(result).toEqual({
        ok: false,
        errorMsg: "User not found.",
      });
    });
  });

  describe("edit Profile", () => {
    it("edit profile", () => {});
  });

  it.todo("editProfile");
  it.todo("mail Verification");
});
