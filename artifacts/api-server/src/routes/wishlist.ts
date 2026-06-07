import { Router, type IRouter } from "express";
import { createWishlistItem, deleteWishlistItem, listWishlist } from "@workspace/db";
import { AddToWishlistBody, RemoveFromWishlistParams } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/wishlist", async (_req, res): Promise<void> => {
  const items = listWishlist().sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());

  res.json(items.map(formatItem));
});

router.post("/wishlist", requireAdmin, async (req, res): Promise<void> => {
  const parsed = AddToWishlistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const item = createWishlistItem(parsed.data);
  res.status(201).json(formatItem(item));
});

router.delete("/wishlist/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = RemoveFromWishlistParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const item = deleteWishlistItem(params.data.id);
  if (!item) {
    res.status(404).json({ error: "Wishlist item not found" });
    return;
  }

  res.json({ success: true });
});

function formatItem(item: { dateAdded: Date }) {
  return {
    ...item,
    dateAdded: item.dateAdded.toISOString(),
  };
}

export default router;
