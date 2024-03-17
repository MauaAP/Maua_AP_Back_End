import { PrismaClient } from "@prisma/client";
import { UserProps } from "../../../../shared/domain/entities/user";

const prisma = new PrismaClient();

export class CreateUserUsecase {
  async createUser(user: UserProps) {
    try {
      console.log("Criando novo usuário:", user);

      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

      if (existingUser) {
        throw new Error("User already exists in the database.");
      }

      const newUser = await prisma.user.create({
        data: user,
      });
      console.log("Usuário criado com sucesso:", newUser);
      return newUser;
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      // Verifica se o erro é devido ao usuário já existente e lança uma mensagem personalizada
      if (error.message.includes("User already exists in the database.")) {
        throw new Error("Usuário já cadastrado.");
      }
      throw new Error("Erro ao criar usuário no banco de dados.");
    }
  }
}
