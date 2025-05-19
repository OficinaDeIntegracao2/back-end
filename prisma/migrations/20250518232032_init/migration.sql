-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "professors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "professors_id_fkey" FOREIGN KEY ("id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "volunteers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "professor_id" TEXT NOT NULL,
    CONSTRAINT "volunteers_id_fkey" FOREIGN KEY ("id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "volunteers_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT
);

-- CreateTable
CREATE TABLE "subjects" (
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
    CONSTRAINT "subjects_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "enrollments" (
    "student_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,

    PRIMARY KEY ("student_id", "subject_id"),
    CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "enrollments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "hour_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "hours" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "logged_by_id" TEXT NOT NULL,
    CONSTRAINT "hour_logs_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "hour_logs_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "hour_logs_logged_by_id_fkey" FOREIGN KEY ("logged_by_id") REFERENCES "volunteers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "hour_changes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hour_log_id" TEXT NOT NULL,
    "previous_hours" REAL NOT NULL,
    "new_hours" REAL NOT NULL,
    "changed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changed_by_id" TEXT NOT NULL,
    CONSTRAINT "hour_changes_hour_log_id_fkey" FOREIGN KEY ("hour_log_id") REFERENCES "hour_logs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "hour_changes_changed_by_id_fkey" FOREIGN KEY ("changed_by_id") REFERENCES "volunteers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "total_hours" REAL NOT NULL,
    "issued_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "professor_id" TEXT NOT NULL,
    CONSTRAINT "certificates_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "certificates_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "certificates_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
