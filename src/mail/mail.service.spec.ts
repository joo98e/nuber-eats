import { MailService } from "@modules/mail/mail.service";
import got from "got";
import * as FormData from "form-data";
import { Test } from "@nestjs/testing";
import { CONFIG_OPTIONS } from "@common/constants/configOptions";

jest.mock("got");
jest.mock("form-data");

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

      jest.spyOn(service, "sendEmail").mockImplementation(async () => true);

      service.sendVerificationEmail(sendEmailArgs.email, sendEmailArgs.code);

      expect(service.sendEmail).toHaveBeenCalledTimes(1);
      expect(service.sendEmail).toHaveBeenCalledWith("Verify Your Email", "verify-email", [
        { key: "code", value: sendEmailArgs.code },
        { key: "username", value: sendEmailArgs.email },
      ]);
    });
  });

  describe("sendVerificationEmail", () => {
    it("sends email", async function () {
      const ok = await service.sendEmail("", "", []);

      const formSpy = jest.spyOn(FormData.prototype, "append");
      expect(formSpy).toHaveBeenCalledTimes(4);
      expect(got.post).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
      expect(ok).toBeTruthy();
    });

    it("fails on Error", async function () {
      jest.spyOn(got, "post").mockImplementation(() => {
        throw new Error();
      });

      const ok = await service.sendEmail("", "", []);
      expect(ok).toBeFalsy();
    });
  });
});
