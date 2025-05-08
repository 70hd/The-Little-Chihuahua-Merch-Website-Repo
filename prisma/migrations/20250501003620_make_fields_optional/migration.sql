-- DropIndex
DROP INDEX `Contact_id_key` ON `Contact`;

-- AlterTable
ALTER TABLE `Contact` MODIFY `phoneNumber` VARCHAR(191) NULL,
    MODIFY `selectLocation` VARCHAR(191) NULL;
