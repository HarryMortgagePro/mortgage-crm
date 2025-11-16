-- CreateTable
CREATE TABLE "BankAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clientId" INTEGER NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNickname" TEXT,
    "maskedAccountNumber" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "mainUser" TEXT,
    "usedFor" TEXT,
    "openedDate" DATETIME,
    "status" TEXT NOT NULL,
    "currency" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BankAccount_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
