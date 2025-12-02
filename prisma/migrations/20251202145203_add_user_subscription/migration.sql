/*
  Warnings:

  - Added the required column `userId` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "billingType" TEXT NOT NULL,
    "cycle" TEXT NOT NULL DEFAULT 'MONTHLY',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "externalRefSubscriptionId" TEXT,
    "nextDueDate" DATETIME,
    "endDate" DATETIME,
    "last4CardDigits" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "packageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "subscriptions_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_subscriptions" ("billingType", "createdAt", "cycle", "deletedAt", "endDate", "externalRefSubscriptionId", "id", "last4CardDigits", "nextDueDate", "packageId", "status", "updatedAt") SELECT "billingType", "createdAt", "cycle", "deletedAt", "endDate", "externalRefSubscriptionId", "id", "last4CardDigits", "nextDueDate", "packageId", "status", "updatedAt" FROM "subscriptions";
DROP TABLE "subscriptions";
ALTER TABLE "new_subscriptions" RENAME TO "subscriptions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
