import { Field, InputType, ObjectType, PartialType } from "@nestjs/graphql";
import { CreateRestaurantInput } from "@modules/restaurants/dtos/create-restaurant.dto";
import { CoreOutput } from "@modules/common/dtos/coreOutput";

@InputType()
export class EditRestaurantInput extends PartialType(CreateRestaurantInput) {
  @Field((type) => Number)
  restaurantId: number;
}

@ObjectType()
export class EditRestaurantOutput extends CoreOutput {}
