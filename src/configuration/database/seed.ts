import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const seed = async () => {
  const hashedPassword = await bcrypt.hash("admin", 8);
  const user = await prisma.user.create({
    data: {
      email: "admin@admin.com",
      password: hashedPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log("Admin created: ", user);
};

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})
