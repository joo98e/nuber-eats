import { Module } from "@nestjs/common";
import { RestaurantsResolver } from "@modules/restaurants/restaurants.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";
import { RestaurantsService } from "@modules/restaurants/restaurants.service";
import { Category } from "@modules/restaurants/entities/category.entity";
import { TypeOrmExtendModule } from "@modules/common/typeorm/typeorm-extend.module";
import CategoryRepository from "@modules/restaurants/repositories/category.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, Category]),
    TypeOrmExtendModule.forCustomRepository([CategoryRepository]),
  ],
  providers: [RestaurantsResolver, RestaurantsService],
})
export class RestaurantsModule {}
