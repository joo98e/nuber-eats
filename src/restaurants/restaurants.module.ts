import { Module } from '@nestjs/common';
import { RestaurantsResolver } from '@modules/restaurants/restaurants.resolver';

@Module({
  providers: [RestaurantsResolver],
})
export class RestaurantsModule {}
