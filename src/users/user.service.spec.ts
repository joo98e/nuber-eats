import { UserService } from "@modules/users/user.service";
import { Test } from "@nestjs/testing";
import { User, UserRoleEnum } from "@modules/users/entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Verification } from "@modules/users/entities/verification.entity";
import { JwtService } from "@modules/jwt/jwt.service";
import { MailService } from "@modules/mail/mail.service";
import { LoginOutput } from "@modules/users/dtos/login.dto";
import { UserProfileOutput } from "@modules/users/dtos/user-profile.dto";
import { AuthUserKey } from "@modules/auth/auth-user.decorator";

const generateMockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
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
      role: UserRoleEnum.CLIENT,
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

    it("unknown Error", async () => {
      userRepository.findOne.mockRejectedValue(new Error());

      const result = await userService.login({ email: MOCK_EMAIL, password: MOCK_PASSWORD });

      expect(result).toEqual({ ok: false, errorMsg: "unknown Error" });
    });

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
      const loginOutput: LoginOutput = { ok: false, errorMsg: "Password is incorrect." };
      expect(result).toEqual(loginOutput);
    });

    it("should return token if password correct", async function () {
      const mockedUser: Partial<User> = {
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };

      userRepository.findOne.mockResolvedValue(mockedUser);
      const result = await userService.login(loginUserArgs);
      const loginOutput: LoginOutput = { ok: true, errorMsg: null, token: SIGNED_TOKEN };
      expect(result).toEqual(loginOutput);
    });
  });

  describe("findById", () => {
    const findByIdArgs = {
      id: 1,
    };

    it("should find an existing user", async () => {
      userRepository.findOneOrFail.mockResolvedValue(findByIdArgs);
      const result = await userService.findById(1);
      const userProfileOutput: UserProfileOutput = { ok: true, user: findByIdArgs as User };
      expect(userRepository.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(result).toEqual(userProfileOutput);
    });

    it("should fail if no user if found", async () => {
      userRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await userService.findById(1);
      const userProfileFailOutput: UserProfileOutput = {
        ok: false,
        user: null,
        errorMsg: "User not found.",
      };
      expect(result).toEqual(userProfileFailOutput);
    });
  });

  describe("edit Profile", () => {
    it("should change email", async () => {
      const EDITED_EMAIL = "bla@bla.com";
      const oldUser: Partial<User> = {
        id: 1,
        email: MOCK_EMAIL,
        verified: true,
      };
      const newUser: Partial<User> = {
        ...oldUser,
        email: EDITED_EMAIL,
        verified: false,
      };
      const editProfileArgs = {
        userId: 1,
        input: { email: EDITED_EMAIL },
      };
      const newVerification = {
        code: "code",
      };

      userRepository.findOne.mockResolvedValue(oldUser);
      verificationRepository.create.mockReturnValue(newVerification);
      verificationRepository.save.mockResolvedValue(newVerification);

      const result = await userService.editProfile(editProfileArgs.userId, editProfileArgs.input);

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: editProfileArgs.userId } });

      // expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1); // 구현하지 않았음

      expect(verificationRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationRepository.create).toHaveBeenCalledWith({ user: newUser });
      expect(verificationRepository.save).toHaveBeenCalledWith(newVerification);

      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(newUser);
    });

    it("should change password", async () => {
      const EDITED_PASSWORD = "password_new";
      const oldUser: Partial<User> = {
        id: 1,
        email: MOCK_EMAIL,
        password: MOCK_PASSWORD,
        verified: true,
      };
      const newUser: Partial<User> = {
        ...oldUser,
        password: EDITED_PASSWORD,
      };
      const editProfileArgs = {
        userId: 1,
        input: { password: EDITED_PASSWORD },
      };

      userRepository.findOne.mockResolvedValue(oldUser);

      const result = await userService.editProfile(editProfileArgs.userId, editProfileArgs.input);

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: editProfileArgs.userId } });

      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(newUser);

      expect(result).toEqual({
        ok: true,
      });
    });

    it("should fail on Exception", async () => {
      const ExceptionMessage = "AN_ERROR_HAS_OCCURRED";
      const editProfileArgs = {
        userId: 1,
        input: {},
      };

      userRepository.findOne.mockRejectedValue(new Error(ExceptionMessage));

      const result = await userService.editProfile(editProfileArgs.userId, editProfileArgs.input);
      expect(result).toEqual({
        ok: false,
        error: ExceptionMessage,
      });
    });
  });

  describe("mail verification test", () => {
    it("should verify email", async () => {
      const TEMP_CODE = "CODE";

      const foundUser: Partial<User> = {
        id: 1,
      };
      const TEMP_USER = new User();

      const foundVerification: Partial<Verification> = {
        id: 1,
        code: TEMP_CODE,
        user: TEMP_USER,
      };

      verificationRepository.findOne.mockResolvedValue(foundVerification);
      verificationRepository.delete.mockResolvedValue(true);

      const result = await userService.verifyEmail(TEMP_CODE);
      expect(verificationRepository.findOne).toHaveBeenCalledTimes(1);
      expect(verificationRepository.findOne).toHaveBeenCalledWith({
        where: { code: TEMP_CODE },
        relations: [AuthUserKey],
      });

      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(foundVerification.user);
      expect(verificationRepository.delete).toHaveBeenCalledTimes(1);
      expect(verificationRepository.delete).toHaveBeenCalledWith(foundVerification.id);
    });

    it("should throw Error when verify to email failed", async () => {
      const TEMP_CODE = "code";
      const MyError = new Error();

      verificationRepository.findOne.mockRejectedValue(MyError);

      const result = await userService.verifyEmail(TEMP_CODE);
      expect(result).toStrictEqual({
        ok: false,
        errorMsg: MyError,
      });
    });
  });
});
