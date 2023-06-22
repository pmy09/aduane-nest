import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateRestaurantDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  userId: string;

  @IsNotEmpty()
  location: string;
}
