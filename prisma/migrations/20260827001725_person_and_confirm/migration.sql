-- CreateTable
CREATE TABLE "Person" (
    "email" TEXT NOT NULL PRIMARY KEY,
    "emailConfirmedAt" DATETIME,
    "confirmToken" TEXT,
    "confirmExpiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_confirmToken_key" ON "Person"("confirmToken");
