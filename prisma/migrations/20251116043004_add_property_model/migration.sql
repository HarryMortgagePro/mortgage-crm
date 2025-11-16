-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "propertyAddress" TEXT NOT NULL,
    "propertyCity" TEXT NOT NULL,
    "propertyProvince" TEXT NOT NULL,
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
