import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dtos';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  addOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.orderService.createOrder(createOrderDto, req);
  }

  // @Get()
  // getAllOrders() {
  //   return this.orderService.getOrders();
  // }

  @Get('myorders')
  getOrder(@Request() req) {
    return this.orderService.getUserOrder(req);
  }

  @Get('restaurant/:id')
  getRestaurantOrder(@Param('id') restaurantId: string, @Request() req) {
    return this.orderService.getRestaurantOrder(restaurantId, req);
  }

  @Patch(':id')
  cancelOrder(@Param('id') orderId: string) {
    return this.orderService.cancelOrder(orderId);
  }

  @Patch('restaurant/:id')
  completeOrder(@Param('id') orderId: string, @Request() req) {
    return this.orderService.completeOrder(orderId, req);
  }
}
