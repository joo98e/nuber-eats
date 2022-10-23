import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {Restaurant} from "@modules/restaurants/entities/restaurant.entity";
import {CreateRestaurantDto} from "@modules/restaurants/dtos/create-restaurant";

/**
 * of : 어떤 모양인지 알려준다.(Restaurant 를 위한 resolver)
 */
@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  /**
   *
   * @returns Restaurant[]
   */
  @Query((returns) => [Restaurant])
  restaurants(
    @Args("veganOnly", { nullable: true }) veganOnly?: boolean,
  ): Restaurant[] {
    return [];
  }

  @Mutation((returns) => Boolean)
  createRestaurant(
    @Args() createRestaurantInput: CreateRestaurantDto,
  ): boolean {
    console.log(createRestaurantInput);

    return true;
  }
}
