import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { IsString, Length } from "class-validator";
import { CoreEntity } from "@modules/common/entities/core.entity";
import { Category } from "@modules/restaurants/entities/category.entity";
import { User } from "@modules/users/entities/user.entity";

@InputType("RestaurantInputType", {
  isAbstract: true,
  description: `Restaurant`,
})
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  address: string;

  @Field((type) => String)
  @Column({ nullable: true })
  @IsString()
  coverImage: string;

  @Field((type) => Category, { nullable: true })
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: "SET NULL",
  })
  category: Category;

  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.restaurants, {
    onDelete: "CASCADE",
  })
  owner: User;
}
