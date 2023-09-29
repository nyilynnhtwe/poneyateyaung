/*
  Warnings:

  - You are about to drop the column `generatedImageCount` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `generatedImageCount`,
    ADD COLUMN `role` ENUM('ADMIN', 'MEMBER') NOT NULL DEFAULT 'MEMBER';
