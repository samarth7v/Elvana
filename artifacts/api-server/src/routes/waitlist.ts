import { Router, type IRouter } from "express";
import { db, waitlistTable } from "@workspace/db";
import { JoinWaitlistBody } from "@workspace/api-zod";
import { eq, count } from "drizzle-orm";

const router: IRouter = Router();

router.post("/waitlist", async (req, res) => {
  const parsed = JoinWaitlistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: "Invalid email address" });
    return;
  }

  const { email } = parsed.data;

  const existing = await db
    .select()
    .from(waitlistTable)
    .where(eq(waitlistTable.email, email))
    .limit(1);

  if (existing.length > 0) {
    res.status(409).json({ error: "This email is already on the waitlist" });
    return;
  }

  await db.insert(waitlistTable).values({ email });

  const [{ value: totalCount }] = await db
    .select({ value: count() })
    .from(waitlistTable);

  res.status(201).json({
    message: "You're on the list! We'll reach out when Elvana is ready.",
    position: Number(totalCount),
  });
});

export default router;
