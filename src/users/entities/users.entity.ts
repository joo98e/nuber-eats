import { Column, Entity } from "typeorm";
import { CoreEntity } from "@modules/common/entities/core.entity";
import { Field, InputType, ObjectType } from "@nestjs/graphql";

type UserRole = "CLIENT" | "OWNER" | "DELIVERY";

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field((type) => String)
  email: string;

  @Column()
  @Field((type) => String)
  password: string;

  @Column()
  @Field((type) => String)
  role: UserRole;
}
