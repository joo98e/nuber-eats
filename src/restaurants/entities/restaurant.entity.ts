import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RestaurantEntity {
  @Field((is) => String)
  name: string;
}
