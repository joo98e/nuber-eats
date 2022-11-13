import { Injectable } from "@nestjs/common";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRestaurantDto } from "@modules/restaurants/dtos/create-restaurant.dto";
import { UpdateRestaurantsDto } from "@modules/restaurants/dtos/update-restaurant.dto";
import { UpdateResult } from "typeorm/query-builder/result/UpdateResult";

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async getAll(): Promise<Restaurant[]> {
    return await this.restaurantRepository.find();
  }

  async createRestaurant(restaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const newRestaurant = this.restaurantRepository.create(restaurantDto);
    return this.restaurantRepository.save(newRestaurant);
  }

  async updateRestaurant({ id, data }: UpdateRestaurantsDto): Promise<UpdateResult> {
    return this.restaurantRepository.update(id, { ...data });
  }
}
