-- CreateEnum
CREATE TYPE "StrategyType" AS ENUM ('SOURCES_OF_HOPE', 'RED_FLAGS', 'SELF_CARE_STRATEGIES', 'HELPFUL_ACTIVITES');

-- CreateTable
CREATE TABLE "journal" (
    "id" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "sources_of_hope" TEXT NOT NULL,
    "red_flags" TEXT NOT NULL,
    "self_care_strategies" TEXT NOT NULL,
    "helpful_activites" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strategy" (
    "id" TEXT NOT NULL,
    "strategyType" "StrategyType" NOT NULL,
    "journalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "strategy_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "journal" ADD CONSTRAINT "journal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategy" ADD CONSTRAINT "strategy_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "journal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
