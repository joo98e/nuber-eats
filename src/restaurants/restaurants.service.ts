import { Injectable } from "@nestjs/common";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRestaurantInput, CreateRestaurantOutput } from "@modules/restaurants/dtos/create-restaurant.dto";
import { User } from "@modules/users/entities/user.entity";
import { Category } from "@modules/restaurants/entities/category.entity";

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
  ) {}

  async createRestaurant(owner: User, createRestaurantInput: CreateRestaurantInput): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurantRepository.create(createRestaurantInput);
      newRestaurant.owner = owner;
      const categoryName = createRestaurantInput.categoryName.trim().toLowerCase();
      const categorySlug = categoryName.replace(/\s/gi, "-");

      let category = await this.categories.findOne({
        where: {
          slug: categorySlug,
        },
      });

      if (!category) {
        category = await this.categories.save(this.categories.create({ name: categoryName, slug: categorySlug }));
      }

      newRestaurant.category = category;
      await this.restaurantRepository.save(newRestaurant);

      return {
        ok: true,
        errorMsg: "",
      };
    } catch (e) {
      return {
        ok: false,
        errorMsg: "알 수 없는 이유로 식당을 만들 수 없습니다.",
      };
    }
  }
}
