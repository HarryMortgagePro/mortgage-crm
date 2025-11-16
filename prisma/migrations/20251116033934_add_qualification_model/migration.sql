-- CreateTable
CREATE TABLE "Qualification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationId" TEXT NOT NULL,
    "applicantIncomeMonthly" REAL,
    "coApplicantIncomeMonthly" REAL,
    "rentalIncomeMonthly" REAL,
    "otherIncomeMonthly" REAL,
    "mortgagePaymentMonthly" REAL,
    "propertyTaxAnnual" REAL,
    "heatingMonthly" REAL,
    "condoFeesMonthly" REAL,
    "otherPropertyCostsMonthly" REAL,
    "creditCardsMonthly" REAL,
    "loansMonthly" REAL,
    "linesOfCreditMonthly" REAL,
    "otherDebtsMonthly" REAL,
    "maxGdsAllowed" REAL,
    "maxTdsAllowed" REAL,
    "calculatedGds" REAL,
    "calculatedTds" REAL,
    "qualifies" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Qualification_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Qualification_applicationId_key" ON "Qualification"("applicationId");
