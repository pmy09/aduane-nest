import { IsNotEmpty } from 'class-validator';

export class CreateMenuDto {
  @IsNotEmpty()
  restaurantId: string;

  @IsNotEmpty()
  name: string;

  description: string;

  image: string;

  @IsNotEmpty()
  price: number;
}
