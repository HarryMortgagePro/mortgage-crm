/*
  Warnings:

  - You are about to drop the column `accountType` on the `BankAccount` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `BankAccount` table. All the data in the column will be lost.
  - You are about to drop the column `mainUser` on the `BankAccount` table. All the data in the column will be lost.
  - You are about to drop the column `ownerName` on the `BankAccount` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BankAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "bankName" TEXT,
    "accountNickname" TEXT,
    "maskedAccountNumber" TEXT,
    "usedFor" TEXT,
    "openedDate" DATETIME,
    "status" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BankAccount_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BankAccount" ("accountNickname", "bankName", "clientId", "createdAt", "id", "maskedAccountNumber", "notes", "openedDate", "status", "updatedAt", "usedFor") SELECT "accountNickname", "bankName", "clientId", "createdAt", "id", "maskedAccountNumber", "notes", "openedDate", "status", "updatedAt", "usedFor" FROM "BankAccount";
DROP TABLE "BankAccount";
ALTER TABLE "new_BankAccount" RENAME TO "BankAccount";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
