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
  createMenu(createMenuDto: CreateMenuDto, req): string {
    const { role } = req.user;
    if (role == 'chef') {
      const newMenu = this.menuRepository.create(createMenuDto);
      newMenu.restaurant = createMenuDto.restaurantId;
      this.menuRepository.save(newMenu);
      return 'Item added';
    }
    throw new UnauthorizedException();
  }

  getMenu(): Promise<Menu[]> {
    return this.menuRepository.find({ relations: ['restaurant'] });
  }

  getSingleMenu(menuId: string): Promise<Menu> {
    return this.findMenu(menuId);
  }

  async updateMenu(
    menuId: string,
    updateMenuDto: CreateMenuDto,
    req,
  ): Promise<Menu> {
    const { role } = req.user;
    if (role == 'chef') {
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

  async deleteMenu(menuId: string, req): Promise<string> {
    const { role } = req.user;
    if (role == 'chef') {
      const menu = await this.findMenu(menuId);
      this.menuRepository.delete(menu);
      return 'Item deleted';
    }
    throw new UnauthorizedException();
  }

  private async findMenu(id: string): Promise<Menu> {
    const menu = await this.menuRepository.findOneBy({ id });
    if (!menu) {
      throw new NotFoundException('Could not find menu.');
    }
    return menu;
  }
}
