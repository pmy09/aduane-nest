export class Menu {
  /**
   * The ID of the menu item.
   */
  public id: string;

  /**
   * The ID of the restaurant to which the menu item belongs.
   */
  public restaurantId: string;

  /**
   * The name of the menu item.
   */
  public name: string;

  /**
   * The description of the menu item.
   */
  public description: string;

  /**
   * The image URL of the menu item.
   */
  public image: string;

  /**
   * The price of the menu item.
   */
  public price: number;

  /**
   * Creates an instance of the Menu class.
   * @param id - The ID of the menu item.
   * @param restaurantId - The ID of the restaurant to which the menu item belongs.
   * @param name - The name of the menu item.
   * @param description - The description of the menu item.
   * @param image - The image URL of the menu item.
   * @param price - The price of the menu item.
   */
  constructor(
    id: string,
    restaurantId: string,
    name: string,
    description: string,
    image: string,
    price: number,
  ) {
    this.id = id;
    this.restaurantId = restaurantId;
    this.name = name;
    this.description = description;
    this.image = image;
    this.price = price;
  }
}
