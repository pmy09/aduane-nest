import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
// import { generateAuthToken } from 'src/helpers/generateAuthToken';
import { hashPassword } from 'src/helpers/hashPassword';
import { Order, User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.dtos';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<string> {
    const { email, password } = createUserDto;
    const existsUser = await this.userRepository.findOneBy({ email });
    if (existsUser) {
      throw new BadRequestException('Email already exists');
    }
    createUserDto.password = hashPassword(password);

    const newUser = this.userRepository.create(createUserDto);
    this.userRepository.save(newUser);
    return 'User successfully created';
  }

  getUsers(req): Promise<Partial<User[]>> {
    const { role } = req.user;
    if (role == 'admin') {
      return this.userRepository.find({
        select: ['id', 'name', 'email', 'role'],
      });
    }
    throw new UnauthorizedException();
  }

  async getSingleUser(userId: string, req): Promise<Partial<User>> {
    const { role } = req.user;
    if (role == 'admin') {
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

  async deleteUser(userId: string, req): Promise<string> {
    const { role } = req.user;
    if (role == 'admin') {
      const user = await this.findUser(userId);
      this.userRepository.delete(user);
      return 'User deleted';
    }
    throw new UnauthorizedException();
  }

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
