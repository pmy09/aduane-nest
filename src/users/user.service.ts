import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { hashPassword } from 'src/helpers/hashPassword';
import { User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.dtos';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Creates a new user.
   * @param createUserDto - The DTO (Data Transfer Object) containing the user information.
   * @returns A string indicating the success of the operation.
   */
  async createUser(createUserDto: CreateUserDto): Promise<string> {
    const { email, password } = createUserDto;
    const existsUser = await this.userRepository.findOneBy({ email });
    if (existsUser) {
      throw new BadRequestException('Email already exists');
    }
    createUserDto.password = hashPassword(password);

    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return 'User successfully created';
  }

  /**
   * Retrieves all users.
   * @param req - The request object.
   * @returns An array of users containing partial information.
   */
  getUsers(req): Promise<Partial<User[]>> {
    const { role } = req.user;
    if (role === 'admin') {
      return this.userRepository.find({
        select: ['id', 'name', 'email', 'role'],
      });
    }
    throw new UnauthorizedException();
  }

  /**
   * Retrieves a single user by ID.
   * @param userId - The ID of the user to retrieve.
   * @param req - The request object.
   * @returns A partial user object containing selected information.
   */
  async getSingleUser(userId: string, req): Promise<Partial<User>> {
    const { role } = req.user;
    if (role === 'admin') {
      const user = await this.findUser(userId);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        order: user.order,
      };
    }
    throw new UnauthorizedException();
  }

  /**
   * Logs in a user.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @returns An object containing the authentication token and user information.
   */
  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const hashedPassword = await hashPassword(password);
    if (user.password !== hashedPassword) {
      throw new BadRequestException('Invalid credentials');
    }
    const payload = { sub: user.id, name: user.name, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
      },
    };
  }

  /**
   * Deletes a user.
   * @param userId - The ID of the user to delete.
   * @param req - The request object.
   * @returns A string indicating the success of the operation.
   */
  async deleteUser(userId: string, req): Promise<string> {
    const { role } = req.user;
    if (role === 'admin') {
      const user = await this.findUser(userId);
      this.userRepository.delete(user);
      return 'User deleted';
    }
    throw new UnauthorizedException();
  }

  /**
   * Finds a user by ID.
   * @param id - The ID of the user to find.
   * @returns The found user object.
   * @throws NotFoundException if the user is not found.
   */
  async findUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role', 'order'],
      relations: ['order'],
    });
    console.log(user);
    if (!user) {
      throw new NotFoundException('Could not find user.');
    }
    return user;
  }
}
