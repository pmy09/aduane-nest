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
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './restaurant.dtos';
import { Public } from 'src/helpers/auth.guard';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  addRestaurant(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @Request() req,
  ): any {
    return this.restaurantService.createRestaurant(createRestaurantDto, req);
  }

  @Public()
  @Get()
  getAllRestaurants() {
    return this.restaurantService.getRestaurants();
  }

  @Public()
  @Get(':id')
  getRestaurant(@Param('id') restaurantId: string) {
    return this.restaurantService.getSingleRestaurant(restaurantId);
  }

  @Patch(':id')
  updateRestaurant(
    @Param('id') restaurantId: string,
    @Body() updateRestaurantDto: CreateRestaurantDto,
    @Request() req,
  ) {
    return this.restaurantService.updateRestaurant(
      restaurantId,
      updateRestaurantDto,
      req,
    );
  }

  @Delete(':id')
  deleteRestaurant(@Param('id') restaurantId: string, @Request() req) {
    return this.restaurantService.deleteRestaurant(restaurantId, req);
  }
}
