import * as FormData from "form-data";
import { Inject, Injectable } from "@nestjs/common";
import { EmailVar } from "@modules/mail/mail.interfaces";
import { CONFIG_OPTIONS } from "@common/constants/configOptions";
import got from "got";

@Injectable()
export class MailService {
  constructor(@Inject(CONFIG_OPTIONS) private readonly options) {}

  async sendEmail(subject: string, template: string, emailVars: EmailVar[]): Promise<boolean> {
    const form = new FormData();
    form.append("from", `Nico from Nuber Eats <mailgun@${this.options.domain}>`);
    form.append("to", `nico@nomadcoders.co`);
    form.append("subject", subject);
    form.append("template", template);
    emailVars.forEach((eVar) => form.append(`v:${eVar.key}`, eVar.value));
    try {
      await got.post(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${this.options.apiKey}`).toString("base64")}`,
        },
        body: form,
      });

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  async sendVerificationEmail(email: string, code: string) {
    await this.sendEmail("Verify Your Email", "verify-email", [
      { key: "code", value: code },
      { key: "username", value: email },
    ]);
  }
}
