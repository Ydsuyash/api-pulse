-- CreateTable
CREATE TABLE "CheckResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "monitorId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "latency" INTEGER NOT NULL,
    "statusCode" INTEGER,
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CheckResult_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CheckResult_monitorId_createdAt_idx" ON "CheckResult"("monitorId", "createdAt");
