-- Credit packs and durable Stripe webhook idempotency.

CREATE TABLE "CreditBalance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditBalance_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CreditTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StripeEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StripeEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CreditBalance_userId_key" ON "CreditBalance"("userId");
CREATE UNIQUE INDEX "CreditTransaction_stripeSessionId_key" ON "CreditTransaction"("stripeSessionId");
CREATE INDEX "CreditTransaction_userId_idx" ON "CreditTransaction"("userId");

ALTER TABLE "CreditBalance" ADD CONSTRAINT "CreditBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CreditTransaction" ADD CONSTRAINT "CreditTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
