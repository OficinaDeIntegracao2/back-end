// delete this?
export class CreatedUserDto {
  id: string;
  name: string;
  email: string
  role: string;
  createdAt: Date;

  constructor(id: string, name: string, email: string, role: string,  createdAt: Date) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.createdAt = createdAt;
  }
} 