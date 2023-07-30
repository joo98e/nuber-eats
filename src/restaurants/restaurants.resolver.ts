import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";
import { RestaurantsService } from "@modules/restaurants/restaurants.service";
import { CreateRestaurantInput, CreateRestaurantOutput } from "@modules/restaurants/dtos/create-restaurant.dto";
import { AuthUser } from "@modules/auth/auth-user.decorator";
import { User } from "@modules/users/entities/user.entity";
import Roles from "@modules/auth/auth-roles.decorator";
import { EditRestaurantInput, EditRestaurantOutput } from "@modules/restaurants/dtos/edit-restaurant.dto";

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Roles(["OWNER"])
  @Mutation((returns) => CreateRestaurantOutput)
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args("input")
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    const { ok, errorMsg } = await this.restaurantService.createRestaurant(authUser, createRestaurantInput);

    return { ok, errorMsg };
  }

  @Roles(["OWNER"])
  @Mutation((type) => EditRestaurantOutput)
  editRestaurant(
    @AuthUser() authUser: User,
    @Args("input") editRestaurantInput: EditRestaurantInput,
  ): EditRestaurantOutput {
    return {
      ok: true,
    };
  }
}
