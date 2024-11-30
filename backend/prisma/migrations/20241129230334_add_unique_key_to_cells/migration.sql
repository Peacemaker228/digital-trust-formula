/*
  Warnings:

  - A unique constraint covering the columns `[tableId,row,column]` on the table `Cell` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cell_tableId_row_column_key" ON "Cell"("tableId", "row", "column");
