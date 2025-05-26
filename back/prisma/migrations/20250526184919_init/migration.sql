/*
  Warnings:

  - You are about to drop the `Atendimento` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Atendimento";

-- CreateTable
CREATE TABLE "Caixa" (
    "id" SERIAL NOT NULL,
    "quantidade_vendas" INTEGER NOT NULL,
    "pagamentos_pendentes" INTEGER NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Caixa_pkey" PRIMARY KEY ("id")
);
