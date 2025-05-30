-- CreateTable
CREATE TABLE "volunteers_to_subjects" (
    "volunteerId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "assigned_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("volunteerId", "subjectId"),
    CONSTRAINT "volunteers_to_subjects_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "volunteers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "volunteers_to_subjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
