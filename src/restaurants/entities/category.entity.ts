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
  @Column({ unique: true })
  @IsString()
  name: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  coverImage: string;

  @Field((type) => String)
  @Column({ unique: true })
  @IsString()
  slug: string;

  @Field((type) => [Restaurant], {
    nullable: true,
  })
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.category, {})
  restaurants: Restaurant[];
}
