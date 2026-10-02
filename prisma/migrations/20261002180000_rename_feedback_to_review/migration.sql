-- RenameTable
ALTER TABLE "Feedback" RENAME TO "Review";

-- RenamePrimaryKey
ALTER TABLE "Review" RENAME CONSTRAINT "Feedback_pkey" TO "Review_pkey";

-- RenameForeignKey
ALTER TABLE "Review" RENAME CONSTRAINT "Feedback_productId_fkey" TO "Review_productId_fkey";

-- RenameIndex
ALTER INDEX "Feedback_productId_isFavorite_idx" RENAME TO "Review_productId_isFavorite_idx";
