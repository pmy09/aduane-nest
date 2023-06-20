import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './menu.dtos';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  @Post()
  addMenu(@Body() createMenuDto: CreateMenuDto): any {
    return this.menuService.createMenu(createMenuDto);
    // return { id: genId };
  }

  @Get()
  getAllMenus() {
    return this.menuService.getMenu();
  }

  @Get(':id')
  getMenu(@Param('id') menuId: string) {
    return this.menuService.getSingleMenu(menuId);
  }

  @Patch(':id')
  updateMenu(
    @Param('id') menuId: string,
    @Body() updateMenuDto: CreateMenuDto,
  ) {
    return this.menuService.updateMenu(menuId, updateMenuDto);
  }

  @Delete(':id')
  deleteMenu(@Param('id') menuId: string) {
    this.menuService.deleteMenu(menuId);
    return null;
  }
}
