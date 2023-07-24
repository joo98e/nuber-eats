import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import { CoreEntity } from "@modules/common/entities/core.entity";
import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from "@nestjs/common";
import { IsBoolean, IsEmail, IsEnum, IsString } from "class-validator";
import { Password } from "@modules/utils/global/types";
import { Restaurant } from "@modules/restaurants/entities/restaurant.entity";

export enum UserRoleEnum {
  CLIENT= "CLIENT",
  OWNER = "OWNER",
  DELIVERY = "DELIVERY",
}

registerEnumType(UserRoleEnum, { name: "UserRole" });

@InputType("UserInputType", {
  isAbstract: true,
  description: `
    UserRoleEnum : using EnumType
  `,
})
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  @IsEmail()
  @Field((type) => String)
  email: string;

  @Column({ select: false })
  @IsString()
  @Field((type) => String)
  password: string;

  @Column({ type: "enum", enum: UserRoleEnum })
  @Field((type) => UserRoleEnum)
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @Field((type) => [Restaurant])
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.category)
  restaurants: Restaurant[];

  @Column({ default: false })
  @IsBoolean()
  @Field((type) => Boolean)
  verified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(password: Password): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
