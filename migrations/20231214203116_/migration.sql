/*
  Warnings:

  - You are about to drop the column `repeatStauses` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `Log` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_userId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "repeatStauses",
ADD COLUMN     "repeatStatuses" JSONB;

-- DropTable
DROP TABLE "Log";
