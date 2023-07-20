import { CoreEntity } from "@modules/common/entities/core.entity";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";

@InputType("CategoryInputType", {
  isAbstract: true,
  description: "Category",
})
@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  coverImage: string;

  @Field((type) => [Restaurant], {
    nullable: true,
  })
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.category, {})
  restaurants: Restaurant[];
}
