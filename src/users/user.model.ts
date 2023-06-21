export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: number,
    public role: Role,
  ) {}
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  CHEF = 'chef',
}
