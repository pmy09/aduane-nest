import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateRestaurantDto {
  /**
   * The name of the restaurant.
   * @type {string}
   * @minimumLength 3 - The name must have a minimum length of 3 characters.
   * @notEmpty - The name must not be empty.
   */
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  /**
   * The ID of the user associated with the restaurant.
   * @type {string}
   */
  userId: string;

  /**
   * The location of the restaurant.
   * @type {string}
   * @notEmpty - The location must not be empty.
   */
  @IsNotEmpty()
  location: string;
}
