import {
  Field,
  InputType,
  ObjectType,
} from "@nestjs/graphql";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

@InputType({
  isAbstract: true,
  description: `
  Restaurant
`,
})
@ObjectType()
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

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

  @Field((type) => Boolean, { defaultValue: false })
  @Column({ default: false })
  @IsOptional()
  @IsBoolean()
  isVegan: boolean;

  @Field((type) => String)
  @Column()
  @IsString()
  address: string;

  @Field((type) => String)
  @Column()
  @IsString()
  ownerName: string;

  @Field((type) => String)
  @Column()
  @IsString()
  categoryName: string;
}
