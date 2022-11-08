import { Module } from "@nestjs/common";
import { RestaurantsResolver } from "@modules/restaurants/restaurants.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";
import { RestaurantsService } from "@modules/restaurants/restaurants.service";

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])],
  providers: [RestaurantsResolver, RestaurantsService],
})
export class RestaurantsModule {}
