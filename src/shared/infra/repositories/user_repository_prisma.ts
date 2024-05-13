import { PrismaClient } from "@prisma/client";
import { UserProps } from "../../../shared/domain/entities/user";
import { IUserRepository } from "../../../shared/domain/repositories/user_repository_interface";
import { User } from "../../domain/entities/user";
import { ROLE } from "../../domain/enums/role_enum";
import bcrypt from "bcrypt";
import { STATUS } from "../../domain/enums/status_enum";

const prisma = new PrismaClient();

export class UserRepositoryPrisma implements IUserRepository {
  async createUser(userProps: UserProps): Promise<User> {
    try {
      console.log("Criando novo usuário:", userProps);

      const existingUser = await prisma.user.findUnique({
        where: {
          email: userProps.email,
        },
      });

      if (existingUser) {
        throw new Error("User already exists in the database.");
      }

      const hashedPassword = await bcrypt.hash(userProps.password, 10);

      const createdUserFromPrisma = await prisma.user.create({
        data: {
          name: userProps.name,
          email: userProps.email,
          role: userProps.role as string,
          password: hashedPassword,
          telefone: userProps.telefone || '', 
          cpf: userProps.cpf || '', 
          status: userProps.status as string,
        },
      });

      const createdUser = new User({
        name: createdUserFromPrisma.name,
        email: createdUserFromPrisma.email,
        role: createdUserFromPrisma.role as ROLE,
        password: createdUserFromPrisma.password,
        telefone: createdUserFromPrisma.telefone,
        cpf: createdUserFromPrisma.cpf,
        status: createdUserFromPrisma.status as STATUS,
      });

      console.log("Usuário criado com sucesso:", createdUser);

      return createdUser;
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      if (error.message.includes("User already exists in the database.")) {
        throw new Error("Usuário já cadastrado.");
      }
      throw new Error("Erro ao criar usuário no banco de dados.");
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!existingUser) {
        return undefined; 
      }

      return new User({
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role as ROLE,
        password: existingUser.password,
        telefone: existingUser.telefone,
        cpf: existingUser.cpf,
        status: existingUser.status as STATUS,
      });
    } catch (error) {
      console.error("Erro ao buscar usuário por email:", error);
      throw new Error("Erro ao buscar usuário por email");
    }
  }

  async getAll(): Promise<User[]> {
    try {
      const allUsersFromPrisma = await prisma.user.findMany();

      const allUsers = allUsersFromPrisma.map((user: any) => {
        return new User({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as ROLE,
          password: user.password,
          telefone: user.telefone,
          cpf: user.cpf,
          status: user.status as STATUS,
        });
      });

      return allUsers;
    } catch (error) {
      console.error("Erro ao buscar todos os usuários:", error);
      throw new Error("Erro ao buscar todos os usuários");
    }
  }

  async getUserById(id: string): Promise<User | undefined> {
    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!existingUser) {
        return undefined; 
      }

      return new User({
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role as ROLE,
        password: existingUser.password,
        telefone: existingUser.telefone,
        cpf: existingUser.cpf,
        status: existingUser.status as STATUS,
      });
    } catch (error) {
      console.error("Erro ao buscar usuário por id:", error);
      throw new Error("Erro ao buscar usuário por id");
    }
  }

  async updateStatus(id: string, status: STATUS): Promise<User> {
    try {
      const updatedUserFromPrisma = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          status: status as STATUS,
        },
      });

      const updatedUser = new User({
        id: updatedUserFromPrisma.id,
        name: updatedUserFromPrisma.name,
        email: updatedUserFromPrisma.email,
        role: updatedUserFromPrisma.role as ROLE,
        password: updatedUserFromPrisma.password,
        telefone: updatedUserFromPrisma.telefone,
        cpf: updatedUserFromPrisma.cpf,
        status: updatedUserFromPrisma.status as STATUS,
      });

      return updatedUser;
    } catch (error) {
      console.error("Erro ao atualizar status do usuário:", error);
      throw new Error("Erro ao atualizar status do usuário");
    }
  }
}
