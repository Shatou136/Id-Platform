-- CreateTable
CREATE TABLE "Staff" (
    "email" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SchoolSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "universityName" TEXT NOT NULL,
    "logoSrc" TEXT NOT NULL,
    "emailEnding" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "Campus" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Programme" (
    "name" TEXT NOT NULL PRIMARY KEY
);
