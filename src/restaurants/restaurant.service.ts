import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './restaurant.dtos';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  /**
   * Creates a new restaurant.
   *
   * @param createRestaurantDto - The DTO (Data Transfer Object) containing the restaurant information.
   * @param req - The request object.
   * @returns The created restaurant.
   * @throws UnauthorizedException if the user is not authorized to create a restaurant.
   */
  createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
    req,
  ): Promise<Restaurant> {
    const { role, sub } = req.user;
    const newRestaurant = this.restaurantRepository.create(createRestaurantDto);

    if (role === 'admin') {
      newRestaurant.user = createRestaurantDto.userId;
      return this.restaurantRepository.save(newRestaurant);
    }

    if (role === 'chef') {
      newRestaurant.user = sub;
      return this.restaurantRepository.save(newRestaurant);
    }

    throw new UnauthorizedException();
  }

  /**
   * Retrieves all restaurants.
   *
   * @returns An array of restaurants.
   */
  getRestaurants(): Promise<Restaurant[]> {
    return this.restaurantRepository.find();
  }

  /**
   * Retrieves a single restaurant by ID.
   *
   * @param restaurantId - The ID of the restaurant to retrieve.
   * @returns The requested restaurant.
   */
  getSingleRestaurant(restaurantId: string): Promise<Restaurant[]> {
    return this.restaurantRepository.find({
      where: { id: restaurantId },
      relations: { menu: true },
    });
  }

  /**
   * Updates a restaurant.
   *
   * @param restaurantId - The ID of the restaurant to update.
   * @param updateRestaurantDto - The DTO containing the updated restaurant information.
   * @param req - The request object.
   * @returns The updated restaurant.
   * @throws UnauthorizedException if the user is not authorized to update the restaurant.
   */
  async updateRestaurant(
    restaurantId: string,
    updateRestaurantDto: CreateRestaurantDto,
    req,
  ): Promise<Restaurant> {
    const { role } = req.user;
    const restaurant = await this.findRestaurant(restaurantId);

    if (role === 'chef' || role === 'admin') {
      if (updateRestaurantDto.name) {
        restaurant.name = updateRestaurantDto.name;
      }
      if (updateRestaurantDto.location) {
        restaurant.location = updateRestaurantDto.location;
      }
      return this.restaurantRepository.save(restaurant);
    }

    throw new UnauthorizedException();
  }

  /**
   * Deletes a restaurant.
   *
   * @param restaurantId - The ID of the restaurant to delete.
   * @param req - The request object.
   * @returns A string indicating the success of the operation.
   * @throws UnauthorizedException if the user is not authorized to delete the restaurant.
   */
  async deleteRestaurant(restaurantId: string, req): Promise<string> {
    const { role } = req.user;

    if (role === 'admin') {
      const restaurant = await this.findRestaurant(restaurantId);
      this.restaurantRepository.delete(restaurant);
      return 'Restaurant deleted successfully';
    }

    throw new UnauthorizedException();
  }

  /**
   * Finds a restaurant by ID.
   *
   * @param id - The ID of the restaurant to find.
   * @returns The found restaurant.
   * @throws NotFoundException if the restaurant is not found.
   */
  private async findRestaurant(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOneBy({ id });

    if (!restaurant) {
      throw new NotFoundException('Could not find restaurant.');
    }

    return restaurant;
  }
}
