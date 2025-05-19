// delete this?
export class CreatedUserDto {
  id: string;
  email: string;
  name: string;
  createdAt: Date;

  constructor(id: string, email: string, name: string, createdAt: Date) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.createdAt = createdAt;
  }
} 