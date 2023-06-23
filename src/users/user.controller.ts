import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from './user.dtos';
import { UsersService } from './user.service';
import { Public } from 'src/helpers/auth.guard';
import { User } from 'src/typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Handles the HTTP POST request to create a new user.
   * @param createUserDto - The DTO containing the user information.
   * @returns A string indicating the success of the operation.
   */
  @Public()
  @Post()
  @UsePipes(new ValidationPipe())
  addUser(@Body() createUserDto: CreateUserDto): Promise<string> {
    return this.usersService.createUser(createUserDto);
  }

  /**
   * Handles the HTTP GET request to retrieve all users.
   * @param req - The request object.
   * @returns An array of partial user objects.
   */
  @Get()
  getAllUsers(@Request() req): Promise<Partial<User[]>> {
    return this.usersService.getUsers(req);
  }

  /**
   * Handles the HTTP GET request to retrieve a single user by ID.
   * @param userId - The ID of the user to retrieve.
   * @param req - The request object.
   * @returns A partial user object.
   */
  @Get(':id')
  getSingleUser(
    @Param('id') userId: string,
    @Request() req,
  ): Promise<Partial<User>> {
    return this.usersService.getSingleUser(userId, req);
  }

  /**
   * Handles the HTTP POST request for user authentication.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns An object containing the authentication token and user information.
   */
  @Public()
  @Post('login')
  authorizeUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.usersService.login(email, password);
  }

  /**
   * Handles the HTTP DELETE request to delete a user by ID.
   * @param userId - The ID of the user to delete.
   * @param req - The request object.
   * @returns A string indicating the success of the operation.
   */
  @Delete(':id')
  deleteUser(@Param('id') userId: string, @Request() req): Promise<string> {
    return this.usersService.deleteUser(userId, req);
  }
}
