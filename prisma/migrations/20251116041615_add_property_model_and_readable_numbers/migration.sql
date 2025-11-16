/*
  Warnings:

  - Added the required column `applicationNumber` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientNumber` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "propertyAddress" TEXT NOT NULL,
    "propertyCity" TEXT NOT NULL,
    "propertyProvince" TEXT NOT NULL,
    "propertyPostal" TEXT,
    "propertyType" TEXT,
    "propertyTaxAnnual" REAL,
    "heatingMonthly" REAL,
    "condoFeesMonthly" REAL,
    "otherExpensesMonthly" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Property_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationNumber" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "propertyId" TEXT,
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
    "lenderName" TEXT,
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
    CONSTRAINT "Application_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Application_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("amortizationYears", "applicationDate", "approvalDate", "clientId", "closingDate", "createdAt", "dealType", "downPayment", "fundedDate", "gdsRatio", "id", "interestRate", "lenderName", "maxQualification", "mortgageAmount", "notes", "occupancy", "propertyAddress", "propertyCity", "propertyPostal", "propertyProvince", "propertyType", "purchasePrice", "purpose", "qualificationSummary", "rateType", "renewalDate", "stage", "submissionDate", "tdsRatio", "termYears", "updatedAt") SELECT "amortizationYears", "applicationDate", "approvalDate", "clientId", "closingDate", "createdAt", "dealType", "downPayment", "fundedDate", "gdsRatio", "id", "interestRate", "lenderName", "maxQualification", "mortgageAmount", "notes", "occupancy", "propertyAddress", "propertyCity", "propertyPostal", "propertyProvince", "propertyType", "purchasePrice", "purpose", "qualificationSummary", "rateType", "renewalDate", "stage", "submissionDate", "tdsRatio", "termYears", "updatedAt" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_applicationNumber_key" ON "Application"("applicationNumber");
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "type" TEXT,
    "primaryContact" TEXT,
    "tags" TEXT,
    "referralSource" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Client" ("createdAt", "email", "firstName", "id", "lastName", "notes", "phone", "primaryContact", "referralSource", "tags", "type", "updatedAt") SELECT "createdAt", "email", "firstName", "id", "lastName", "notes", "phone", "primaryContact", "referralSource", "tags", "type", "updatedAt" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_clientNumber_key" ON "Client"("clientNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
