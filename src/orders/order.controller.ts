import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dtos';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  addOrder(@Body() createOrderDto: CreateOrderDto): any {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get()
  getAllOrders() {
    return this.orderService.getOrders();
  }

  @Get(':id')
  getOrder(@Param('id') userId: string) {
    return this.orderService.getUserOrder(userId);
  }

  @Get('restaurant/:id')
  getRestaurantOrder(@Param('id') restaurantId: string) {
    return this.orderService.getRestaurantOrder(restaurantId);
  }

  @Patch(':id')
  cancelOrder(@Param('id') orderId: string) {
    return this.orderService.cancelOrder(orderId);
  }

  @Patch('restaurant/:id')
  completeOrder(@Param('id') orderId: string) {
    return this.orderService.completeOrder(orderId);
  }

//   @Patch(':id')
//   updateOrder(
//     @Param('id') orderId: string,
//     @Body() updateOrderDto: CreateOrderDto,
//   ) {
//     return this.orderService.updateOrder(orderId, updateOrderDto);
//   }

//   @Delete(':id')
//   deleteOrder(@Param('id') orderId: string) {
//     this.orderService.deleteOrder(orderId);
//     return null;
//   }
}
