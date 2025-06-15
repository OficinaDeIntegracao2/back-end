/*
  Warnings:

  - Made the column `email` on table `students` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL
);
INSERT INTO "new_students" ("email", "id", "name") SELECT "email", "id", "name" FROM "students";
DROP TABLE "students";
ALTER TABLE "new_students" RENAME TO "students";
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
