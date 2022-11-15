import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateRestaurantDto } from "@modules/restaurants/dtos/create-restaurant.dto";

@InputType()
class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {}

@InputType()
export class UpdateRestaurantsDto {
  @Field((type) => Number)
  id: number;

  @Field((type) => UpdateRestaurantDto)
  data: UpdateRestaurantDto;
}
