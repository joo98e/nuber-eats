import { ArgsType, Field, InputType, OmitType } from "@nestjs/graphql";
import { IsBoolean, IsString, Length } from "class-validator";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";

// @InputType() => 오브젝트 1개 타입 inputType 일 경우 이름도 적어주어야 하고, 속성도 모두 적어주어야 한다.
// @ArgsType() => {...} 형태
@InputType()
export class CreateRestaurantDto extends OmitType(Restaurant, ["id"]) {}
