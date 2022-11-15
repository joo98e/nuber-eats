import { BeforeInsert, Column, Entity } from "typeorm";
import { CoreEntity } from "@modules/common/entities/core.entity";
import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from "@nestjs/common";
import { IsEmail, IsEnum } from "class-validator";
import { Password } from "@modules/utils/global/types";

enum UserRoleEnum {
  CLIENT,
  OWNER,
  DELIVERY,
}

registerEnumType(UserRoleEnum, { name: "UserRole" });

@InputType({
  isAbstract: true,
  description: `
    UserRoleEnum : using EnumType
  `,
})
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @IsEmail()
  @Field((type) => String)
  email: string;

  @Column()
  @Field((type) => String)
  password: string;

  @Column({ type: "enum", enum: UserRoleEnum })
  @Field((type) => UserRoleEnum)
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async comparePassword(password: Password): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
