import { Injectable, NotFoundException } from '@nestjs/common';
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
  createRestaurant(createRestaurantDto: CreateRestaurantDto) {
    // const prodId = Math.random().toString();
    const newRestaurant = this.restaurantRepository.create(createRestaurantDto);
    return this.restaurantRepository.save(newRestaurant);
    // return prodId;
  }

  getRestaurant() {
    // return this.restaurantRepository.find();
    return this.restaurantRepository.find({ relations: { menu: true } });
  }

  getSingleRestaurant(restaurantId: string) {
    return this.findRestaurant(restaurantId);
  }

  async updateRestaurant(
    restaurantId: string,
    updateRestaurantDto: CreateRestaurantDto,
  ) {
    const restaurant = await this.findRestaurant(restaurantId);
    if (updateRestaurantDto.name) {
      restaurant.name = updateRestaurantDto.name;
    }
    if (updateRestaurantDto.location) {
      restaurant.location = updateRestaurantDto.location;
    }
    return this.restaurantRepository.save(restaurant);
  }

  async deleteRestaurant(restaurantId: string) {
    const restaurant = await this.findRestaurant(restaurantId);
    this.restaurantRepository.delete(restaurant);
  }

  private async findRestaurant(id: string) {
    const restaurant = await this.restaurantRepository.findOneBy({ id });
    if (!restaurant) {
      throw new NotFoundException('Could not find restaurant.');
    }
    return restaurant;
  }
}
