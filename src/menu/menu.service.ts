import { Injectable, NotFoundException } from '@nestjs/common';
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
  createMenu(createMenuDto: CreateMenuDto) {
    // const prodId = Math.random().toString();
    // const newMenu = this.menuRepository.create(createMenuDto);
    const newMenu = this.menuRepository.create(createMenuDto);
    console.log(
      '🚀 ~ file: menu.service.ts:16 ~ MenuService ~ createMenu ~ newMenu:',
      newMenu,
    );
    newMenu.restaurant = createMenuDto.restaurantId;
    return this.menuRepository.save(newMenu);
    // return prodId;
  }

  getMenu() {
    // return this.menuRepository.find();
    return this.menuRepository.find({ relations: ['restaurant'] });
  }

  getSingleMenu(menuId: string) {
    return this.findMenu(menuId);
  }

  async updateMenu(menuId: string, updateMenuDto: CreateMenuDto) {
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

  async deleteMenu(menuId: string) {
    const menu = await this.findMenu(menuId);
    this.menuRepository.delete(menu);
  }

  private async findMenu(id: string) {
    const menu = await this.menuRepository.findOneBy({ id });
    if (!menu) {
      throw new NotFoundException('Could not find menu.');
    }
    return menu;
  }
}
