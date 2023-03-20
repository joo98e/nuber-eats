import { Repository } from "typeorm";

declare global {
  type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;
}
