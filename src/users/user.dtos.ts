import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from './user.model';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsEnum(Role)
  role: Role;
}
