import { IsNotEmpty } from 'class-validator';

export class CreateMenuDto {
  /**
   * The ID of the restaurant to which the menu item belongs.
   * @type {string}
   * @notEmpty - The restaurant ID must not be empty.
   */
  @IsNotEmpty()
  restaurantId: string;

  /**
   * The name of the menu item.
   * @type {string}
   * @notEmpty - The menu item name must not be empty.
   */
  @IsNotEmpty()
  name: string;

  /**
   * The description of the menu item.
   * @type {string}
   */
  description: string;

  /**
   * The image URL of the menu item.
   * @type {string}
   */
  image: string;

  /**
   * The price of the menu item.
   * @type {number}
   * @notEmpty - The menu item price must not be empty.
   */
  @IsNotEmpty()
  price: number;
}
