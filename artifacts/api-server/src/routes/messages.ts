import { Router, type IRouter } from "express";
import { createMessage, listMessages } from "@workspace/db";
import { CreateMessageBody } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/messages", requireAdmin, async (_req, res): Promise<void> => {
  const messages = listMessages().sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  res.json(messages.map(m => ({ ...m, timestamp: m.timestamp.toISOString() })));
});

router.post("/messages", async (req, res): Promise<void> => {
  const parsed = CreateMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const message = createMessage(parsed.data);
  res.status(201).json({ ...message, timestamp: message.timestamp.toISOString() });
});

export default router;
