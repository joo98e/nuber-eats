import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";
import { RestaurantsService } from "@modules/restaurants/restaurants.service";
import { CreateRestaurantInput, CreateRestaurantOutput } from "@modules/restaurants/dtos/create-restaurant.dto";
import { AuthUser } from "@modules/auth/auth-user.decorator";
import { User } from "@modules/users/entities/user.entity";
import Roles from "@modules/auth/auth-roles.decorator";

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Roles(["OWNER"])
  @Mutation((returns) => Boolean)
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args("input")
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    console.log(123123);
    return await this.restaurantService.createRestaurant(authUser, createRestaurantInput);
  }
}
