/**
 * Represents a user entity.
 */
export class User {
  /**
   * The ID of the user.
   * @type {string}
   */
  public id: string;

  /**
   * The name of the user.
   * @type {string}
   */
  public name: string;

  /**
   * The email of the user.
   * @type {string}
   */
  public email: string;

  /**
   * The password of the user.
   * @type {number}
   */
  public password: number;

  /**
   * The role of the user.
   * @type {Role}
   */
  public role: Role;

  /**
   * Creates an instance of the User class.
   * @param {string} id - The ID of the user.
   * @param {string} name - The name of the user.
   * @param {string} email - The email of the user.
   * @param {number} password - The password of the user.
   * @param {Role} role - The role of the user.
   */
  constructor(
    id: string,
    name: string,
    email: string,
    password: number,
    role: Role,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}

/**
 * Represents the roles available for a user.
 */
export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  CHEF = 'chef',
}
