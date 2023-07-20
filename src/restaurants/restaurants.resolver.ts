import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";
import { RestaurantsService } from "@modules/restaurants/restaurants.service";
import { CreateRestaurantInputType } from "@modules/restaurants/dtos/create-restaurant.dto";

/**
 * of : 어떤 모양인지 알려준다.(Restaurant 를 위한 resolver)
 * Controller
 */
@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Mutation((returns) => Boolean)
  async createRestaurant(
    @Args("request")
    createRestaurantDto: CreateRestaurantInputType,
  ): Promise<boolean> {
    try {
      await this.restaurantService.createRestaurant(createRestaurantDto);
      return true;
    } catch (e) {
      return false;
    }
  }
}
