import { Router, type IRouter } from "express";
import { createCar, deleteCar, getCarById, listCars, updateCar } from "@workspace/db";
import {
  ListCarsQueryParams,
  CreateCarBody,
  GetCarParams,
  UpdateCarParams,
  UpdateCarBody,
  DeleteCarParams,
  GetRecentCarsQueryParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/cars/stats", async (_req, res): Promise<void> => {
  const cars = listCars();

  const totalCars = cars.length;
  const rareCars = cars.filter(c =>
    c.rarity === "Treasure Hunt" || c.rarity === "Super Treasure Hunt" || c.rarity === "Collector Edition" || c.rarity === "Convention Exclusive"
  ).length;
  const superTreasureHunts = cars.filter(c => c.rarity === "Super Treasure Hunt").length;
  const seriesSet = new Set(cars.map(c => c.series));
  const totalSeries = seriesSet.size;
  const years = cars.map(c => c.year).filter(Boolean);
  const newestYear = years.length ? Math.max(...years) : null;
  const oldestYear = years.length ? Math.min(...years) : null;

  const rarityMap: Record<string, number> = {};
  for (const car of cars) {
    rarityMap[car.rarity] = (rarityMap[car.rarity] ?? 0) + 1;
  }
  const byRarity = Object.entries(rarityMap).map(([rarity, count]) => ({ rarity, count }));

  const seriesMap: Record<string, number> = {};
  for (const car of cars) {
    seriesMap[car.series] = (seriesMap[car.series] ?? 0) + 1;
  }
  const bySeries = Object.entries(seriesMap)
    .map(([series, count]) => ({ series, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const sorted = [...cars].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
  const latestAddition = sorted[0]?.name ?? null;

  res.json({
    totalCars,
    rareCars,
    superTreasureHunts,
    totalSeries,
    newestYear,
    oldestYear,
    byRarity,
    bySeries,
    latestAddition,
  });
});

router.get("/cars/recent", async (req, res): Promise<void> => {
  const parsed = GetRecentCarsQueryParams.safeParse(req.query);
  const limit = parsed.success && parsed.data.limit ? parsed.data.limit : 6;

  const cars = listCars()
    .sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime())
    .slice(0, limit);

  res.json(cars.map(formatCar));
});

router.get("/cars/spotlight", async (_req, res): Promise<void> => {
  const cars = listCars();
  if (!cars.length) {
    res.status(404).json({ error: "No cars in collection" });
    return;
  }
  const random = cars[Math.floor(Math.random() * cars.length)];
  res.json(formatCar(random));
});

router.get("/cars", async (req, res): Promise<void> => {
  const parsed = ListCarsQueryParams.safeParse(req.query);
  const params = parsed.success ? parsed.data : {};

  const search = params.search?.trim().toLowerCase();

  const cars = listCars()
    .filter((car) => {
      if (search && !car.name.toLowerCase().includes(search)) {
        return false;
      }
      if (params.series && car.series !== params.series) {
        return false;
      }
      if (params.rarity && car.rarity !== params.rarity) {
        return false;
      }
      if (params.year && car.year !== params.year) {
        return false;
      }
      if (params.yearMin && car.year < params.yearMin) {
        return false;
      }
      if (params.yearMax && car.year > params.yearMax) {
        return false;
      }
      return true;
    })
    .sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());

  res.json(cars.map(formatCar));
});

router.post("/cars", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateCarBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const car = createCar(parsed.data);
  res.status(201).json(formatCar(car));
});

router.get("/cars/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetCarParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const car = getCarById(params.data.id);
  if (!car) {
    res.status(404).json({ error: "Car not found" });
    return;
  }

  res.json(formatCar(car));
});

router.patch("/cars/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateCarParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const parsed = UpdateCarBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const car = updateCar(params.data.id, parsed.data);

  if (!car) {
    res.status(404).json({ error: "Car not found" });
    return;
  }

  res.json(formatCar(car));
});

router.delete("/cars/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteCarParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const car = deleteCar(params.data.id);
  if (!car) {
    res.status(404).json({ error: "Car not found" });
    return;
  }

  res.json({ success: true });
});

function formatCar(car: { dateAdded: Date }) {
  return {
    ...car,
    dateAdded: car.dateAdded.toISOString(),
  };
}

export default router;
