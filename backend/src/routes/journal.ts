import { Router } from "express";
import { db } from "../db";
import { journalEntries } from "../db/schema";
import { journalEntrySchema } from "../utils/validators";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { and, desc, eq } from "drizzle-orm";

const journalRouter = Router();

journalRouter.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const entries = await db.query.journalEntries.findMany({
    where: eq(journalEntries.userId, req.userId!),
    orderBy: [desc(journalEntries.visitedDate)],
  });

  const countries = Array.from(new Set(entries.map((entry) => entry.country))).sort();

  return res.json({ entries, countries });
});

journalRouter.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = journalEntrySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid data", issues: parsed.error.issues });
  }

  const payload = parsed.data;

  const [created] = await db
    .insert(journalEntries)
    .values({
      userId: req.userId!,
      city: payload.city,
      country: payload.country,
      latitude: payload.latitude,
      longitude: payload.longitude,
      visitedDate: payload.visitedDate,
      title: payload.title,
      description: payload.description ?? null,
      companions: payload.companions ?? null,
      rating: payload.rating ?? null,
    })
    .returning();

  return res.status(201).json({ entry: created });
});

journalRouter.put("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = journalEntrySchema.partial().extend({ visitedDate: journalEntrySchema.shape.visitedDate.optional() }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid data", issues: parsed.error.issues });
  }

  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid entry id" });
  }

  const updatePayload = Object.fromEntries(
    Object.entries(parsed.data).filter(([, value]) => value !== undefined)
  );

  const [updated] = await db
    .update(journalEntries)
    .set({
      ...updatePayload,
      updatedAt: new Date(),
    })
    .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, req.userId!)))
    .returning();

  if (!updated) {
    return res.status(404).json({ message: "Entry not found" });
  }

  return res.json({ entry: updated });
});

journalRouter.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid entry id" });
  }

  const [deleted] = await db
    .delete(journalEntries)
    .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, req.userId!)))
    .returning({ id: journalEntries.id });

  if (!deleted) {
    return res.status(404).json({ message: "Entry not found" });
  }

  return res.status(204).end();
});

export default journalRouter;
