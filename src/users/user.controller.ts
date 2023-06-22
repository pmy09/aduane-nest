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
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from './user.dtos';
import { UsersService } from './user.service';
import { AuthGuard, Public } from 'src/helpers/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Public()
  @Post()
  @UsePipes(new ValidationPipe())
  addUser(@Body() createUserDto: CreateUserDto): any {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  getAllUsers(@Request() req) {
    return this.usersService.getUsers(req);
  }

  @Get(':id')
  getSingleUser(@Param('id') userId: string, @Request() req) {
    return this.usersService.getSingleUser(userId, req);
  }

  @Public()
  @Post('login')
  authorizeUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.usersService.login(email, password);
  }

  @Delete(':id')
  deleteUser(@Param('id') userId: string, @Request() req) {
    return this.usersService.deleteUser(userId, req);
  }
}
