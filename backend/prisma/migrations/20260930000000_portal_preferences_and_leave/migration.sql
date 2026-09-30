ALTER TABLE "User" ADD COLUMN "preferences" JSONB;
CREATE TABLE "LeaveRequest" (
  "id" TEXT NOT NULL, "internId" TEXT NOT NULL, "type" TEXT NOT NULL, "from" TEXT NOT NULL, "to" TEXT NOT NULL,
  "reason" TEXT NOT NULL, "days" INTEGER NOT NULL, "status" TEXT NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "LeaveRequest_internId_fkey" FOREIGN KEY ("internId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "LeaveRequest_internId_createdAt_idx" ON "LeaveRequest"("internId", "createdAt");
