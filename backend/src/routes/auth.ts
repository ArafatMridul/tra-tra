import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema";
import { loginSchema, registerSchema } from "../utils/validators";
import { eq } from "drizzle-orm";
import { AuthenticatedRequest } from "../middleware/auth";

const authRouter = Router();

const COOKIE_NAME = "token";

const createToken = (userId: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
};

const setAuthCookie = (res: any, token: string) => {
  const secure = process.env.COOKIE_SECURE === "true";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid data", issues: parsed.error.issues });
  }

  const { email, password, fullName } = parsed.data;

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [created] = await db
    .insert(users)
    .values({ email, passwordHash, fullName })
    .returning({ id: users.id, fullName: users.fullName, email: users.email });

  const token = createToken(created.id);
  setAuthCookie(res, token);

  return res.status(201).json({ user: { id: created.id, email: created.email, fullName: created.fullName } });
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid credentials", issues: parsed.error.issues });
  }

  const { email, password } = parsed.data;

  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = createToken(user.id);
  setAuthCookie(res, token);

  return res.json({ user: { id: user.id, email: user.email, fullName: user.fullName, avatarUrl: user.avatarUrl, bio: user.bio } });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME);
  return res.status(204).end();
});

authRouter.get("/me", async (req: AuthenticatedRequest, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }
    const payload = jwt.verify(token, secret) as { userId: string };
    const user = await db.query.users.findFirst({ where: eq(users.id, payload.userId) });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.json({ user: { id: user.id, email: user.email, fullName: user.fullName, avatarUrl: user.avatarUrl, bio: user.bio } });
  } catch (error) {
    res.clearCookie(COOKIE_NAME);
    return res.status(401).json({ message: "Invalid token" });
  }
});

export default authRouter;
