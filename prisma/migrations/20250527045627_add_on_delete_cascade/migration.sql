-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_certificates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "total_hours" REAL NOT NULL,
    "issued_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "professor_id" TEXT NOT NULL,
    CONSTRAINT "certificates_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "certificates_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "certificates_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professors" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_certificates" ("id", "issued_at", "professor_id", "student_id", "subject_id", "total_hours") SELECT "id", "issued_at", "professor_id", "student_id", "subject_id", "total_hours" FROM "certificates";
DROP TABLE "certificates";
ALTER TABLE "new_certificates" RENAME TO "certificates";
CREATE TABLE "new_enrollments" (
    "student_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,

    PRIMARY KEY ("student_id", "subject_id"),
    CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "enrollments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_enrollments" ("student_id", "subject_id") SELECT "student_id", "subject_id" FROM "enrollments";
DROP TABLE "enrollments";
ALTER TABLE "new_enrollments" RENAME TO "enrollments";
CREATE TABLE "new_hour_changes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hour_log_id" TEXT NOT NULL,
    "previous_hours" REAL NOT NULL,
    "new_hours" REAL NOT NULL,
    "changed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changed_by_id" TEXT NOT NULL,
    CONSTRAINT "hour_changes_hour_log_id_fkey" FOREIGN KEY ("hour_log_id") REFERENCES "hour_logs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "hour_changes_changed_by_id_fkey" FOREIGN KEY ("changed_by_id") REFERENCES "volunteers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_hour_changes" ("changed_at", "changed_by_id", "hour_log_id", "id", "new_hours", "previous_hours") SELECT "changed_at", "changed_by_id", "hour_log_id", "id", "new_hours", "previous_hours" FROM "hour_changes";
DROP TABLE "hour_changes";
ALTER TABLE "new_hour_changes" RENAME TO "hour_changes";
CREATE TABLE "new_hour_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "hours" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "logged_by_id" TEXT NOT NULL,
    CONSTRAINT "hour_logs_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "hour_logs_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "hour_logs_logged_by_id_fkey" FOREIGN KEY ("logged_by_id") REFERENCES "volunteers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_hour_logs" ("date", "hours", "id", "logged_by_id", "student_id", "subject_id") SELECT "date", "hours", "id", "logged_by_id", "student_id", "subject_id" FROM "hour_logs";
DROP TABLE "hour_logs";
ALTER TABLE "new_hour_logs" RENAME TO "hour_logs";
CREATE TABLE "new_professors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "professors_id_fkey" FOREIGN KEY ("id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_professors" ("id") SELECT "id" FROM "professors";
DROP TABLE "professors";
ALTER TABLE "new_professors" RENAME TO "professors";
CREATE TABLE "new_subjects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "weekdays" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "duration_weeks" TEXT NOT NULL,
    "total_hours" REAL NOT NULL,
    "professor_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "subjects_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professors" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_subjects" ("created_at", "description", "duration_weeks", "end_time", "id", "name", "professor_id", "start_time", "total_hours", "updated_at", "weekdays") SELECT "created_at", "description", "duration_weeks", "end_time", "id", "name", "professor_id", "start_time", "total_hours", "updated_at", "weekdays" FROM "subjects";
DROP TABLE "subjects";
ALTER TABLE "new_subjects" RENAME TO "subjects";
CREATE TABLE "new_volunteers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "professor_id" TEXT NOT NULL,
    CONSTRAINT "volunteers_id_fkey" FOREIGN KEY ("id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "volunteers_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professors" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_volunteers" ("id", "professor_id") SELECT "id", "professor_id" FROM "volunteers";
DROP TABLE "volunteers";
ALTER TABLE "new_volunteers" RENAME TO "volunteers";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
