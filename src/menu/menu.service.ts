import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuDto } from './menu.dtos';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  /**
   * Creates a new menu item.
   * @param createMenuDto - Data transfer object for creating a menu item.
   * @param req - The HTTP request object.
   * @returns A success message indicating the addition of the menu item.
   * @throws UnauthorizedException if the user does not have the 'chef' role.
   */
  createMenu(createMenuDto: CreateMenuDto, req): string {
    const { role } = req.user;
    if (role === 'chef') {
      const newMenu = this.menuRepository.create(createMenuDto);
      newMenu.restaurant = createMenuDto.restaurantId;
      this.menuRepository.save(newMenu);
      return 'Item added';
    }
    throw new UnauthorizedException();
  }

  /**
   * Retrieves all menu items.
   * @returns An array of menu items.
   */
  getMenu(): Promise<Menu[]> {
    return this.menuRepository.find({ relations: ['restaurant'] });
  }

  /**
   * Retrieves a single menu item by its ID.
   * @param menuId - The ID of the menu item.
   * @returns The requested menu item.
   * @throws NotFoundException if the menu item is not found.
   */
  getSingleMenu(menuId: string): Promise<Menu> {
    return this.findMenu(menuId);
  }

  /**
   * Updates a menu item.
   * @param menuId - The ID of the menu item to be updated.
   * @param updateMenuDto - Data transfer object for updating a menu item.
   * @param req - The HTTP request object.
   * @returns The updated menu item.
   * @throws UnauthorizedException if the user does not have the 'chef' role.
   * @throws NotFoundException if the menu item is not found.
   */
  async updateMenu(
    menuId: string,
    updateMenuDto: CreateMenuDto,
    req,
  ): Promise<Menu> {
    const { role } = req.user;
    if (role === 'chef') {
      const menu = await this.findMenu(menuId);
      if (updateMenuDto.name) {
        menu.name = updateMenuDto.name;
      }
      if (updateMenuDto.description) {
        menu.description = updateMenuDto.description;
      }
      if (updateMenuDto.image) {
        menu.image = updateMenuDto.image;
      }
      if (updateMenuDto.price) {
        menu.price = updateMenuDto.price;
      }
      return this.menuRepository.save(menu);
    }
    throw new UnauthorizedException();
  }

  /**
   * Deletes a menu item.
   * @param menuId - The ID of the menu item to be deleted.
   * @param req - The HTTP request object.
   * @returns A success message indicating the deletion of the menu item.
   * @throws UnauthorizedException if the user does not have the 'chef' role.
   * @throws NotFoundException if the menu item is not found.
   */
  async deleteMenu(menuId: string, req): Promise<string> {
    const { role } = req.user;
    if (role === 'chef') {
      const menu = await this.findMenu(menuId);
      this.menuRepository.delete(menu);
      return 'Item deleted';
    }
    throw new UnauthorizedException();
  }

  /**
   * Finds a menu item by its ID.
   * @param id - The ID of the menu item.
   * @returns The found menu item.
   * @throws NotFoundException if the menu item is not found.
   */
  private async findMenu(id: string): Promise<Menu> {
    const menu = await this.menuRepository.findOneBy({ id });
    if (!menu) {
      throw new NotFoundException('Could not find menu.');
    }
    return menu;
  }
}
