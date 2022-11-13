import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@modules/users/entities/users.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  getOne() {
    return 1;
  }
}
