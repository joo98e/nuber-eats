import { Injectable } from "@nestjs/common";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRestaurantInput, CreateRestaurantOutput } from "@modules/restaurants/dtos/create-restaurant.dto";
import { User } from "@modules/users/entities/user.entity";
import { Category } from "@modules/restaurants/entities/category.entity";
import { EditRestaurantInput, EditRestaurantOutput } from "@modules/restaurants/dtos/edit-restaurant.dto";
import { TryCatch } from "@modules/utils/decorator/catch.decorator";
import CategoryRepository from "@modules/restaurants/repositories/category.repository";

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  @TryCatch()
  async getOrCreateCategory(name: string): Promise<Category> {
    const categoryName = name.trim().toLowerCase();
    const categorySlug = categoryName.replace(/\s/gi, "-");

    let category = await this.categories.findOne({
      where: {
        slug: categorySlug,
      },
    });

    if (!category) {
      category = await this.categories.save(this.categories.create({ name: categoryName, slug: categorySlug }));
    }

    return category;
  }

  @TryCatch("Could not create restaurant")
  async createRestaurant(owner: User, createRestaurantInput: CreateRestaurantInput): Promise<CreateRestaurantOutput> {
    const newRestaurant = this.restaurantRepository.create(createRestaurantInput);
    newRestaurant.owner = owner;
    newRestaurant.category = await this.getOrCreateCategory(createRestaurantInput.categoryName);
    await this.restaurantRepository.save(newRestaurant);

    return {
      ok: true,
      errorMsg: "",
    };
  }

  @TryCatch("Could not edit restaurant")
  async editRestaurant(owner: User, editRestaurantInput: EditRestaurantInput): Promise<EditRestaurantOutput> {
    const restaurant = await this.restaurantRepository.findOne({
      where: {
        id: editRestaurantInput.restaurantId,
      },
    });

    if (!restaurant) {
      return {
        ok: false,
        errorMsg: "Restaurant not found",
      };
    }

    if (restaurant.ownerId !== owner.id)
      return {
        ok: false,
        errorMsg: "You can't edit a restaurant that you don't own",
      };

    return null;
  }
}
