import {ArgsType, Field} from "@nestjs/graphql";
import {IsBoolean, IsString, Length} from "class-validator";

// @InputType() => 오브젝트 1개 타입 inputtype일 경우 이름도 적어주어야 하고, 속성도 모두 적어주어야 한다.
// @ArgsType() => {...} 형태
@ArgsType()
export class CreateRestaurantDto {
  @Field((type) => String)
  @IsString()
  @Length(5, 10)
  name: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  desc?: string;

  @Field((type) => Boolean)
  @IsBoolean()
  isVegan: boolean;

  @Field((type) => String)
  @IsString()
  address: string;

  @Field((type) => String)
  @IsString()
  ownerName: string;
}
