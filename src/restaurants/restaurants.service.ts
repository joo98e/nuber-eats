import { Injectable } from "@nestjs/common";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRestaurantInputType } from "@modules/restaurants/dtos/create-restaurant.dto";

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async createRestaurant(restaurantDto: CreateRestaurantInputType): Promise<Restaurant> {
    const newRestaurant = this.restaurantRepository.create(restaurantDto);
    return this.restaurantRepository.save(newRestaurant);
  }
}
