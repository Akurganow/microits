/*
  Warnings:

  - You are about to drop the column `deleted` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "deleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "deleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "deleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "settings" JSONB;

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
