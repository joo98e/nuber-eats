import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";
import { RestaurantsService } from "@modules/restaurants/restaurants.service";
import { CreateRestaurantInput, CreateRestaurantOutput } from "@modules/restaurants/dtos/create-restaurant.dto";
import { AuthUser } from "@modules/auth/auth-user.decorator";
import { User } from "@modules/users/entities/user.entity";
import Roles from "@modules/auth/auth-roles.decorator";

/**
 * of : 어떤 모양인지 알려준다.(Restaurant 를 위한 resolver)
 * Controller
 */
@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Mutation((returns) => Boolean)
  @Roles(["CLIENT"])
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args("request")
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return await this.restaurantService.createRestaurant(authUser, createRestaurantInput);
  }
}
