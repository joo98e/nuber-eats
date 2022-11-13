import { Column, Entity } from "typeorm";
import { CoreEntity } from "@modules/common/entities/core.entity";

type UserRole = "CLIENT" | "OWNER" | "DELIVERY";

@Entity()
export class User extends CoreEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;
}
