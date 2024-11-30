/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Table` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Table" DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "CellStyle" (
    "id" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "row" INTEGER NOT NULL,
    "column" TEXT NOT NULL,
    "textColor" TEXT,
    "cellColor" TEXT,
    "font" TEXT,
    "borderStyle" TEXT,

    CONSTRAINT "CellStyle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CellStyle_tableId_row_column_key" ON "CellStyle"("tableId", "row", "column");

-- AddForeignKey
ALTER TABLE "CellStyle" ADD CONSTRAINT "CellStyle_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
