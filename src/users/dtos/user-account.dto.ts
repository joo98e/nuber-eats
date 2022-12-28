import { DefaultResponse } from "@modules/common/dtos/default.response";
import { ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserAccountDto extends DefaultResponse {}
