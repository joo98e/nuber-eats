import { DynamicModule, Global, Module } from "@nestjs/common";
import { MailModuleOptions } from "./mail.interfaces";
import { MailService } from "@modules/mail/mail.service";
import { CONFIG_OPTIONS } from "@common/constants/configOptions";

@Module({
  providers: [MailService],
})
@Global()
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        MailService,
      ],
      exports: [MailService],
    };
  }
}
