import { Injectable } from "@nestjs/common";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRestaurantDto } from "@modules/restaurants/dtos/create-restaurant.dto";

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async getAll(): Promise<Restaurant[]> {
    await this.restaurantRepository.find();

    return [];
  }

  async createRestaurant(restaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const newRestaurant = this.restaurantRepository.create(restaurantDto);
    return this.restaurantRepository.save(newRestaurant);
  }
}
