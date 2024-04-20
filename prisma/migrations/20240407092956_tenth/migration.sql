-- CreateTable
CREATE TABLE "cbt" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cbt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cbt_favourite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cbtId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cbt_favourite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cbt_method_rating" (
    "id" TEXT NOT NULL,
    "cbt_method_id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "feedback" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cbt_method_rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cbt_title_key" ON "cbt"("title");

-- AddForeignKey
ALTER TABLE "cbt_favourite" ADD CONSTRAINT "cbt_favourite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cbt_favourite" ADD CONSTRAINT "cbt_favourite_cbtId_fkey" FOREIGN KEY ("cbtId") REFERENCES "cbt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cbt_method_rating" ADD CONSTRAINT "cbt_method_rating_cbt_method_id_fkey" FOREIGN KEY ("cbt_method_id") REFERENCES "cbt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cbt_method_rating" ADD CONSTRAINT "cbt_method_rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
