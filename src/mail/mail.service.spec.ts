import { MailService } from "@modules/mail/mail.service";
import { Test } from "@nestjs/testing";
import got from "got";
import formData from "form-data";
import { CONFIG_OPTIONS } from "@common/constants/configOptions";

jest.mock("got", () => {});
jest.mock("form-data", () => ({
  append: jest.fn(),
}));

describe("Mail Service", () => {
  let service: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            apiKey: "apiKey",
            domain: "domain",
            fromEmail: "fromEmail",
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it("should be defined", function () {
    expect(service).toBeDefined();
  });

  it.todo("sendEmail");
  describe("sendEmail", () => {
    it("should call sendEmail", () => {
      const sendEmailArgs = {
        email: "email",
        code: "code",
      };

      jest.spyOn(service, "sendEmail").mockImplementation(async () => {
        console.log("spy On");
      });

      service.sendVerificationEmail(sendEmailArgs.email, sendEmailArgs.code);

      expect(service.sendEmail).toHaveBeenCalledTimes(1);
      expect(service.sendEmail).toHaveBeenCalledWith("Verify Your Email", "verify-email", [
        { key: "code", value: sendEmailArgs.code },
        { key: "username", value: sendEmailArgs.email },
      ]);
    });
  });
  it.todo("sendVerificationEmail");
});
