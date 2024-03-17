import { PrismaClient } from "@prisma/client";
import { UserProps } from "../../../shared/domain/entities/user"; 
import { IUserRepository } from "../../../shared/domain/repositories/user_repository_interface";
import { User } from "../../domain/entities/user";
import { ROLE } from "../../domain/enums/role_enum";
import bcrypt from "bcrypt";


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
          },
        });
  
        const createdUser = new User({
          name: createdUserFromPrisma.name,
          email: createdUserFromPrisma.email,
          role: createdUserFromPrisma.role as ROLE,
          password: createdUserFromPrisma.password,
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
  }
  