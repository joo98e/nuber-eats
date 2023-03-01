import { Repository } from "typeorm";
import { User } from "@modules/users/entities/user.entity";

declare global {
  type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;
}
