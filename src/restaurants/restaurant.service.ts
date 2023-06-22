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
  createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
    req,
  ): Promise<Restaurant> {
    const { role, sub } = req.user;
    const newRestaurant = this.restaurantRepository.create(createRestaurantDto);
    if (role == 'admin') {
      newRestaurant.user = createRestaurantDto.userId;
      return this.restaurantRepository.save(newRestaurant);
    }
    if (role == 'chef') {
      newRestaurant.user = sub;
      return this.restaurantRepository.save(newRestaurant);
    }
    throw new UnauthorizedException();
  }

  getRestaurants(): Promise<Restaurant[]> {
    return this.restaurantRepository.find();
  }

  getSingleRestaurant(restaurantId: string): Promise<Restaurant[]> {
    return this.restaurantRepository.find({
      where: { id: restaurantId },
      relations: { menu: true },
    });
  }

  async updateRestaurant(
    restaurantId: string,
    updateRestaurantDto: CreateRestaurantDto,
    req,
  ): Promise<Restaurant> {
    const { role } = req.user;
    const restaurant = await this.findRestaurant(restaurantId);
    if (role == 'chef' || role == 'admin') {
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

  async deleteRestaurant(restaurantId: string, req): Promise<string> {
    const { role } = req.user;
    if (role == 'admin') {
      const restaurant = await this.findRestaurant(restaurantId);
      this.restaurantRepository.delete(restaurant);
      return 'Restaurant deleted successfully';
    }
    throw new UnauthorizedException();
  }

  private async findRestaurant(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOneBy({ id });
    if (!restaurant) {
      throw new NotFoundException('Could not find restaurant.');
    }
    return restaurant;
  }
}
