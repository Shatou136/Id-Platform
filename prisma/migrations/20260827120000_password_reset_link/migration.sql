-- AlterTable
ALTER TABLE "Person" ADD COLUMN "resetToken" TEXT;
ALTER TABLE "Person" ADD COLUMN "resetExpiresAt" DATETIME;

-- CreateIndex
CREATE UNIQUE INDEX "Person_resetToken_key" ON "Person"("resetToken");
