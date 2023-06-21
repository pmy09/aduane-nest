import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './user.dtos';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  addUser(@Body() createUserDto: CreateUserDto): any {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  getAllUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  getProduct(@Param('id') userId: string) {
    return this.usersService.getSingleUser(userId);
  }

  @Post('login')
  authorizeUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.usersService.login(email, password);
  }

  @Delete(':id')
  deleteProduct(@Param('id') userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
