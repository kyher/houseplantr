/*
  Warnings:

  - You are about to drop the column `fedDate` on the `Feeding` table. All the data in the column will be lost.
  - You are about to drop the column `wateredDate` on the `Watering` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Feeding" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "plantId" TEXT NOT NULL,
    CONSTRAINT "Feeding_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Feeding" ("createdAt", "id", "plantId", "updatedAt") SELECT "createdAt", "id", "plantId", "updatedAt" FROM "Feeding";
DROP TABLE "Feeding";
ALTER TABLE "new_Feeding" RENAME TO "Feeding";
CREATE TABLE "new_Watering" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "plantId" TEXT NOT NULL,
    CONSTRAINT "Watering_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Watering" ("createdAt", "id", "plantId", "updatedAt") SELECT "createdAt", "id", "plantId", "updatedAt" FROM "Watering";
DROP TABLE "Watering";
ALTER TABLE "new_Watering" RENAME TO "Watering";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
