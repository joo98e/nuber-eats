import { Query, Resolver } from "@nestjs/graphql";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  @Query((returns) => Boolean)
  isPizzaGood() {
    return true;
  }

  @Query((returns) => Restaurant)
  myRestaurant() {
    return true;
  }
}
