/*
  Warnings:

  - You are about to drop the `Lender` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `lenderId` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Application` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Lender";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Product";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "dealType" TEXT,
    "purpose" TEXT,
    "propertyAddress" TEXT,
    "propertyCity" TEXT,
    "propertyProvince" TEXT,
    "propertyPostal" TEXT,
    "propertyType" TEXT,
    "occupancy" TEXT,
    "purchasePrice" REAL,
    "mortgageAmount" REAL,
    "downPayment" REAL,
    "amortizationYears" INTEGER,
    "termYears" INTEGER,
    "rateType" TEXT,
    "interestRate" REAL,
    "applicationDate" DATETIME,
    "submissionDate" DATETIME,
    "approvalDate" DATETIME,
    "closingDate" DATETIME,
    "fundedDate" DATETIME,
    "renewalDate" DATETIME,
    "maxQualification" REAL,
    "gdsRatio" REAL,
    "tdsRatio" REAL,
    "qualificationSummary" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Application_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("amortizationYears", "applicationDate", "approvalDate", "clientId", "closingDate", "createdAt", "dealType", "downPayment", "fundedDate", "gdsRatio", "id", "interestRate", "maxQualification", "mortgageAmount", "notes", "occupancy", "propertyAddress", "propertyCity", "propertyPostal", "propertyProvince", "propertyType", "purchasePrice", "purpose", "qualificationSummary", "rateType", "renewalDate", "stage", "submissionDate", "tdsRatio", "termYears", "updatedAt") SELECT "amortizationYears", "applicationDate", "approvalDate", "clientId", "closingDate", "createdAt", "dealType", "downPayment", "fundedDate", "gdsRatio", "id", "interestRate", "maxQualification", "mortgageAmount", "notes", "occupancy", "propertyAddress", "propertyCity", "propertyPostal", "propertyProvince", "propertyType", "purchasePrice", "purpose", "qualificationSummary", "rateType", "renewalDate", "stage", "submissionDate", "tdsRatio", "termYears", "updatedAt" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
