import { CoreOutput } from "@modules/common/dtos/coreOutput";
import { ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserAccountDto extends CoreOutput {}
