/*
  Warnings:

  - You are about to drop the column `professor_id` on the `volunteers` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_volunteers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "volunteers_id_fkey" FOREIGN KEY ("id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_volunteers" ("id") SELECT "id" FROM "volunteers";
DROP TABLE "volunteers";
ALTER TABLE "new_volunteers" RENAME TO "volunteers";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
