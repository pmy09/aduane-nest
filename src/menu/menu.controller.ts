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
import { Menu } from 'src/typeorm';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * Endpoint to create a new menu item.
   * @param createMenuDto - Data transfer object for creating a menu item.
   * @param req - The HTTP request object.
   * @returns A success message indicating the addition of the menu item.
   */
  @Post()
  @UsePipes(new ValidationPipe())
  addMenu(@Body() createMenuDto: CreateMenuDto, @Request() req): string {
    return this.menuService.createMenu(createMenuDto, req);
  }

  /**
   * Endpoint to get all menu items.
   * @returns An array of menu items.
   */
  @Public()
  @Get()
  getAllMenus(): Promise<Menu[]> {
    return this.menuService.getMenu();
  }

  /**
   * Endpoint to get a single menu item by its ID.
   * @param menuId - The ID of the menu item.
   * @returns The requested menu item.
   */
  @Public()
  @Get(':id')
  getMenu(@Param('id') menuId: string): Promise<Menu> {
    return this.menuService.getSingleMenu(menuId);
  }

  /**
   * Endpoint to update a menu item.
   * @param menuId - The ID of the menu item to be updated.
   * @param updateMenuDto - Data transfer object for updating a menu item.
   * @param req - The HTTP request object.
   * @returns The updated menu item.
   */
  @Patch(':id')
  updateMenu(
    @Param('id') menuId: string,
    @Body() updateMenuDto: CreateMenuDto,
    @Request() req,
  ): Promise<Menu> {
    return this.menuService.updateMenu(menuId, updateMenuDto, req);
  }

  /**
   * Endpoint to delete a menu item.
   * @param menuId - The ID of the menu item to be deleted.
   * @param req - The HTTP request object.
   * @returns A success message indicating the menu item deletion.
   */
  @Delete(':id')
  deleteMenu(@Param('id') menuId: string, @Request() req): Promise<string> {
    return this.menuService.deleteMenu(menuId, req);
  }
}
