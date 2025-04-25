/*
  Warnings:

  - You are about to drop the column `conversationId` on the `message` table. All the data in the column will be lost.
  - You are about to drop the `_userconversations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `conversation` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `password` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `_userconversations` DROP FOREIGN KEY `_UserConversations_A_fkey`;

-- DropForeignKey
ALTER TABLE `_userconversations` DROP FOREIGN KEY `_UserConversations_B_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_conversationId_fkey`;

-- DropIndex
DROP INDEX `Message_conversationId_idx` ON `message`;

-- AlterTable
ALTER TABLE `message` DROP COLUMN `conversationId`;

-- AlterTable
ALTER TABLE `user` MODIFY `password` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_userconversations`;

-- DropTable
DROP TABLE `conversation`;
