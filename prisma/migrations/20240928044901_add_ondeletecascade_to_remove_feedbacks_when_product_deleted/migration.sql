-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_productId_fkey";

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
