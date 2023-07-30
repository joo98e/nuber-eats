import { PartialType } from "@nestjs/graphql";
import { CreateRestaurantInput } from "@modules/restaurants/dtos/create-restaurant.dto";

export class EditRestaurantInput extends PartialType(CreateRestaurantInput) {}

