import { Injectable } from "@nestjs/common";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRestaurantInput, CreateRestaurantOutput } from "@modules/restaurants/dtos/create-restaurant.dto";
import { User } from "@modules/users/entities/user.entity";

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async createRestaurant(owner: User, createRestaurantInput: CreateRestaurantInput): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurantRepository.create(createRestaurantInput);
      await this.restaurantRepository.save(newRestaurant);
      return {
        ok: true,
        errorMsg: "",
      };
    } catch (e) {
      return {
        ok: false,
        errorMsg: "Could not create Restaurant.",
      };
    }
  }
}
