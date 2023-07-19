import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { IsString, Length } from "class-validator";
import { CoreEntity } from "@modules/common/entities/core.entity";
import { Category } from "@modules/restaurants/entities/category.entity";

@InputType({
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

  @Field((type) => String, { nullable: true })
  @Column()
  @IsString()
  @Length(5, 24)
  desc?: string;

  @Field((type) => String)
  @Column()
  @IsString()
  address: string;

  @Field((type) => String)
  @Column()
  @IsString()
  coverImage: string;

  @Field((type) => String)
  @Column()
  @IsString()
  ownerName: string;

  @Field(type => Category)
  @ManyToOne((type) => Category, (category) => category.restaurants)
  category: Category;
}
