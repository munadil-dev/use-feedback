-- CreateIndex
CREATE INDEX "Product_userId_idx" ON "Product"("userId");

-- CreateIndex
CREATE INDEX "Feedback_productId_isFavorite_idx" ON "Feedback"("productId", "isFavorite");
