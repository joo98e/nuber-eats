import { Query, Resolver } from "@nestjs/graphql";
import { RestaurantEntity } from "@modules/restaurants/entities/restaurant.entity";

@Resolver((of) => RestaurantEntity)
export class RestaurantsResolver {
  @Query((returns) => Boolean)
  isPizzaGood() {
    return true;
  }
}
