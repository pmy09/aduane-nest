import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './menu.dtos';
import { Public } from 'src/helpers/auth.guard';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  addMenu(@Body() createMenuDto: CreateMenuDto, @Request() req) {
    return this.menuService.createMenu(createMenuDto, req);
  }

  @Public()
  @Get()
  getAllMenus() {
    return this.menuService.getMenu();
  }

  @Public()
  @Get(':id')
  getMenu(@Param('id') menuId: string) {
    return this.menuService.getSingleMenu(menuId);
  }

  @Patch(':id')
  updateMenu(
    @Param('id') menuId: string,
    @Body() updateMenuDto: CreateMenuDto,
    @Request() req,
  ) {
    return this.menuService.updateMenu(menuId, updateMenuDto, req);
  }

  @Delete(':id')
  deleteMenu(@Param('id') menuId: string, @Request() req) {
    return this.menuService.deleteMenu(menuId, req);
  }
}
