import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './restaurant.dtos';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}
  @Post()
  addRestaurant(@Body() createRestaurantDto: CreateRestaurantDto): any {
    return this.restaurantService.createRestaurant(createRestaurantDto);
    // return { id: genId };
  }

  @Get()
  getAllRestaurants() {
    return this.restaurantService.getRestaurant();
  }

  @Get(':id')
  getRestaurant(@Param('id') restaurantId: string) {
    return this.restaurantService.getSingleRestaurant(restaurantId);
  }

  @Patch(':id')
  updateRestaurant(
    @Param('id') restaurantId: string,
    @Body() updateRestaurantDto: CreateRestaurantDto,
  ) {
    return this.restaurantService.updateRestaurant(
      restaurantId,
      updateRestaurantDto,
    );
  }

  @Delete(':id')
  deleteRestaurant(@Param('id') restaurantId: string) {
    this.restaurantService.deleteRestaurant(restaurantId);
    return null;
  }
}
