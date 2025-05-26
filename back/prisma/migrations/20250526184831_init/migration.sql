-- CreateEnum
CREATE TYPE "Tipo_pagamento" AS ENUM ('DINHEIRO', 'PIX', 'CARTAO', 'PENDENTE');

-- CreateEnum
CREATE TYPE "Status_pagamento" AS ENUM ('PAGO', 'PENDENTE');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "tamanho" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "preco_original" DOUBLE PRECISION NOT NULL,
    "preco_revenda" DOUBLE PRECISION NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendas" (
    "id" SERIAL NOT NULL,
    "nome_cliente" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "tipo_pagamento" "Tipo_pagamento" NOT NULL,
    "status_pagamento" "Status_pagamento" NOT NULL,
    "valor_venda" DOUBLE PRECISION NOT NULL,
    "data_venda" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_pagamento" TEXT NOT NULL,
    "produtoId" INTEGER NOT NULL,

    CONSTRAINT "Vendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Atendimento" (
    "id" SERIAL NOT NULL,
    "quantidade_vendas" INTEGER NOT NULL,
    "pagamentos_pendentes" INTEGER NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Atendimento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Vendas" ADD CONSTRAINT "Vendas_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
