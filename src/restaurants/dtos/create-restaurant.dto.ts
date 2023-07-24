import { InputType, ObjectType, OmitType } from "@nestjs/graphql";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";
import { CoreOutput } from "@modules/common/dtos/coreOutput";

// @InputType() => 오브젝트 1개 타입 inputType 일 경우 이름도 적어주어야 하고, 속성도 모두 적어주어야 한다.
// @ArgsType() => {...} 형태
@InputType()
export class CreateRestaurantInput extends OmitType(Restaurant, ["id", "category", "owner"]) {}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}
