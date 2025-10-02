import { Router } from "express";
import { db } from "../db";
import { users } from "../db/schema";
import { profileSchema } from "../utils/validators";
import { eq } from "drizzle-orm";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";

const profileRouter = Router();

profileRouter.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = await db.query.users.findFirst({ where: eq(users.id, req.userId!) });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
    },
  });
});

profileRouter.put("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid data", issues: parsed.error.issues });
  }

  const { fullName, bio, avatarUrl } = parsed.data;

  const [updated] = await db
    .update(users)
    .set({
      fullName,
      bio: bio?.length ? bio : null,
      avatarUrl: avatarUrl?.length ? avatarUrl : null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, req.userId!))
    .returning({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      bio: users.bio,
      avatarUrl: users.avatarUrl,
    });

  if (!updated) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ user: updated });
});

export default profileRouter;
