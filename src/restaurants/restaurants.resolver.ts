import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";
import { CreateRestaurantDto } from "@modules/restaurants/dtos/create-restaurant";
import { RestaurantsService } from "@modules/restaurants/restaurants.service";

/**
 * of : 어떤 모양인지 알려준다.(Restaurant 를 위한 resolver)
 * Controller
 */
@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Query((returns) => [Restaurant])
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAll();
  }

  @Mutation((returns) => Boolean)
  createRestaurant(
    @Args() createRestaurantInput: CreateRestaurantDto,
  ): boolean {
    return true;
  }
}
