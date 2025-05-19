export class AuthenticatedUserDto {
  id: string;
  email: string;
  name: string;
  role: String;

  constructor(id: string, email: string, name: string, role: string) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.role = role;
  }
}