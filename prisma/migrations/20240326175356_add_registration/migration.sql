/*
  Warnings:

  - A unique constraint covering the columns `[telefone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[registration]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `registration` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "registration" TEXT NOT NULL,
ALTER COLUMN "cpf" DROP DEFAULT,
ALTER COLUMN "telefone" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "User_telefone_key" ON "User"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_registration_key" ON "User"("registration");
