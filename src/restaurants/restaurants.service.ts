import { Injectable } from "@nestjs/common";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

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
}
