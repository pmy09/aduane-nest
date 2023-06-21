import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateAuthToken } from 'src/helpers/generateAuthToken';
import { hashPassword } from 'src/helpers/hashPassword';
import { Order, User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.dtos';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<string> {
    const { email, password } = createUserDto;
    const existsUser = await this.userRepository.findOneBy({ email });
    console.log(existsUser);
    if (existsUser) {
      throw new BadRequestException('Email already exists');
    }
    createUserDto.password = hashPassword(password);

    const newUser = this.userRepository.create(createUserDto);
    this.userRepository.save(newUser);
    return 'User successfully created';
  }

  getUsers() {
    return this.userRepository.find({
      select: ['id', 'name', 'email', 'role', 'order'],
      relations: ['order'],
    });
  }

  async getSingleUser(userId: string) {
    const user = await this.findUser(userId);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      order: user.order,
    };
  }

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
    const token = await generateAuthToken(user.id);
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async deleteUser(userId: string) {
    const user = await this.findUser(userId);
    this.userRepository.delete(user);
    return 'User deleted';
  }

  async findUser(id: string) {
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
