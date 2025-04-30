/*
  Warnings:

  - Added the required column `inventory` to the `Size` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Size` ADD COLUMN `inventory` INTEGER NOT NULL,
    ADD COLUMN `status` ENUM('AVAILABLE', 'LOW_STOCK', 'OUT_OF_STOCK') NULL;
