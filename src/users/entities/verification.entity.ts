import { CoreEntity } from "@modules/common/entities/core.entity";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToOne, JoinColumn, BeforeInsert } from "typeorm";
import { User } from "@modules/users/entities/user.entity";
import { v4 as uuidv4 } from "uuid";

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field((type) => String)
  code: string;

  @OneToOne((type) => User)
  @JoinColumn()
  user: User;

  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
