import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from './user.model';

/**
 * Data transfer object for creating a user.
 */
export class CreateUserDto {
  /**
   * The name of the user.
   * @type {string}
   * @notEmpty - The name must not be empty.
   * @minLength - The name must have a minimum length of 3 characters.
   */
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  /**
   * The password of the user.
   * @type {string}
   * @notEmpty - The password must not be empty.
   * @minLength - The password must have a minimum length of 8 characters.
   */
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  /**
   * The email of the user.
   * @type {string}
   * @notEmpty - The email must not be empty.
   * @isEmail - The email must be a valid email address.
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * The role of the user.
   * @type {Role}
   * @isEnum - The role must be a valid value from the Role enum.
   */
  @IsEnum(Role)
  role: Role;
}
