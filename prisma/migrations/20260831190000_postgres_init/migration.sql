-- CreateTable
CREATE TABLE "Staff" (
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    CONSTRAINT "Staff_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "SchoolSettings" (
    "id" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "logoSrc" TEXT NOT NULL,
    "emailEnding" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "SchoolSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campus" (
    "name" TEXT NOT NULL,
    CONSTRAINT "Campus_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Programme" (
    "name" TEXT NOT NULL,
    CONSTRAINT "Programme_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Person" (
    "email" TEXT NOT NULL,
    "emailConfirmedAt" TIMESTAMP(3),
    "confirmToken" TEXT,
    "confirmExpiresAt" TIMESTAMP(3),
    "resetToken" TEXT,
    "resetExpiresAt" TIMESTAMP(3),
    "pushSubscription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Person_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_confirmToken_key" ON "Person"("confirmToken");

-- CreateIndex
CREATE UNIQUE INDEX "Person_resetToken_key" ON "Person"("resetToken");

-- CreateIndex
CREATE INDEX "Request_studentEmail_idx" ON "Request"("studentEmail");

-- CreateIndex
CREATE INDEX "Request_matricule_idx" ON "Request"("matricule");

-- CreateIndex
CREATE INDEX "Request_status_idx" ON "Request"("status");
