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
import { Restaurant } from 'src/typeorm';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  /**
   * Add a new restaurant.
   *
   * @param createRestaurantDto - The data of the restaurant to be created.
   * @param req - The request object containing user information.
   * @returns The created restaurant.
   */
  @Post()
  @UsePipes(new ValidationPipe())
  addRestaurant(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @Request() req,
  ): Promise<Restaurant> {
    return this.restaurantService.createRestaurant(createRestaurantDto, req);
  }

  /**
   * Get all restaurants.
   *
   * @returns An array of restaurants.
   */
  @Public()
  @Get()
  getAllRestaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getRestaurants();
  }

  /**
   * Get a single restaurant by ID.
   *
   * @param restaurantId - The ID of the restaurant to retrieve.
   * @returns The requested restaurant.
   */
  @Public()
  @Get(':id')
  getRestaurant(@Param('id') restaurantId: string): Promise<Restaurant[]> {
    return this.restaurantService.getSingleRestaurant(restaurantId);
  }

  /**
   * Update a restaurant.
   *
   * @param restaurantId - The ID of the restaurant to update.
   * @param updateRestaurantDto - The updated data for the restaurant.
   * @param req - The request object containing user information.
   * @returns The updated restaurant.
   */
  @Patch(':id')
  updateRestaurant(
    @Param('id') restaurantId: string,
    @Body() updateRestaurantDto: CreateRestaurantDto,
    @Request() req,
  ): Promise<Restaurant> {
    return this.restaurantService.updateRestaurant(
      restaurantId,
      updateRestaurantDto,
      req,
    );
  }

  /**
   * Delete a restaurant.
   *
   * @param restaurantId - The ID of the restaurant to delete.
   * @param req - The request object containing user information.
   * @returns A success message indicating that the restaurant was deleted.
   */
  @Delete(':id')
  deleteRestaurant(
    @Param('id') restaurantId: string,
    @Request() req,
  ): Promise<string> {
    return this.restaurantService.deleteRestaurant(restaurantId, req);
  }
}
