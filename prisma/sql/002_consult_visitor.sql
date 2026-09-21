ALTER TABLE "Consult" ADD COLUMN "visitorId" TEXT;
CREATE INDEX "Consult_visitorId_idx" ON "Consult"("visitorId");
