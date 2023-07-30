import { PartialType } from "@nestjs/graphql";
import { CreateRestaurantInput } from "@modules/restaurants/dtos/create-restaurant.dto";
import { CoreOutput } from "@modules/common/dtos/coreOutput";

export class EditRestaurantInput extends PartialType(CreateRestaurantInput) {}

export class EditRestaurantOutput extends CoreOutput {}
