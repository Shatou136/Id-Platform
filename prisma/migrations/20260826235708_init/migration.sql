-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentEmail" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "fullName" TEXT NOT NULL DEFAULT '',
    "sex" TEXT NOT NULL DEFAULT 'Female',
    "dateOfBirth" TEXT NOT NULL DEFAULT '',
    "placeOfBirth" TEXT NOT NULL DEFAULT '',
    "matricule" TEXT NOT NULL DEFAULT '',
    "programme" TEXT NOT NULL DEFAULT '',
    "campus" TEXT NOT NULL DEFAULT '',
    "expiry" TEXT NOT NULL DEFAULT '',
    "photoSrc" TEXT NOT NULL DEFAULT '',
    "turnDownReason" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Request_studentEmail_idx" ON "Request"("studentEmail");

-- CreateIndex
CREATE INDEX "Request_matricule_idx" ON "Request"("matricule");

-- CreateIndex
CREATE INDEX "Request_status_idx" ON "Request"("status");
