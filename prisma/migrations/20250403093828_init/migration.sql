-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "cast" TEXT NOT NULL,
    "theater" TEXT NOT NULL,
    "seat" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "showId" TEXT NOT NULL,
    "recommend" BOOLEAN NOT NULL,
    "review" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Show" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "theater" TEXT NOT NULL,
    "poster" TEXT NOT NULL,

    CONSTRAINT "Show_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;
