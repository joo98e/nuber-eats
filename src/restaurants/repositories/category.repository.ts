import { Repository } from "typeorm";
import { Category } from "@modules/restaurants/entities/category.entity";
import { CustomRepository } from "@modules/common/typeorm/typeorm-extend.decorator";

@CustomRepository(Category)
export default class CategoryRepository extends Repository<Category> {}
