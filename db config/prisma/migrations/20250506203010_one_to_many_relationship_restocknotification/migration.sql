-- DropForeignKey
ALTER TABLE `RestockNotification` DROP FOREIGN KEY `RestockNotification_productId_fkey`;

-- DropIndex
DROP INDEX `RestockNotification_productId_key` ON `RestockNotification`;

-- CreateIndex
CREATE INDEX `RestockNotification_productId_idx` ON `RestockNotification`(`productId`);

-- AddForeignKey
ALTER TABLE `Prices` ADD CONSTRAINT `Prices_productId_fkey_v2` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
