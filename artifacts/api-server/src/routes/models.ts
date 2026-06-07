import { Router, type IRouter } from "express";
import { SearchModelsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

const HOT_WHEELS_MODELS = [
  { name: "Twin Mill", year: 1969, series: "Classic" },
  { name: "Deora II", year: 2000, series: "Classic" },
  { name: "Bone Shaker", year: 2006, series: "Mainline" },
  { name: "Dodge Charger", year: 1969, series: "Mainline" },
  { name: "Camaro SS", year: 2010, series: "Mainline" },
  { name: "Ford Mustang GT", year: 2015, series: "Mainline" },
  { name: "Ferrari 458 Italia", year: 2010, series: "Premium" },
  { name: "Lamborghini Aventador", year: 2011, series: "Premium" },
  { name: "McLaren Senna", year: 2018, series: "Premium" },
  { name: "Porsche 911 GT3 RS", year: 2016, series: "Premium" },
  { name: "Custom '67 Pontiac Firebird", year: 2019, series: "Treasure Hunt" },
  { name: "Ratbomb", year: 2012, series: "Treasure Hunt" },
  { name: "Custom '71 El Camino", year: 2020, series: "Super Treasure Hunt" },
  { name: "'69 Dodge Charger 500", year: 2021, series: "Super Treasure Hunt" },
  { name: "Corvette C8", year: 2020, series: "Mainline" },
  { name: "Tesla Model S", year: 2013, series: "Mainline" },
  { name: "Aston Martin DB5", year: 1963, series: "Mainline" },
  { name: "BMW M3 GT2", year: 2009, series: "Mainline" },
  { name: "Nissan Skyline GT-R", year: 1999, series: "Mainline" },
  { name: "Toyota Supra MK4", year: 1993, series: "Mainline" },
  { name: "Bugatti Veyron", year: 2005, series: "Premium" },
  { name: "Pagani Huayra", year: 2012, series: "Premium" },
  { name: "Koenigsegg CCX", year: 2006, series: "Premium" },
  { name: "Ford GT", year: 2005, series: "Mainline" },
  { name: "Shelby Cobra 427 S/C", year: 1965, series: "Classic" },
  { name: "Pontiac GTO", year: 1966, series: "Classic" },
  { name: "1970 Plymouth Barracuda", year: 1970, series: "Classic" },
  { name: "Deora III", year: 2018, series: "Mainline" },
  { name: "Hot Wheels Rapid Transit", year: 2019, series: "Collector Edition" },
  { name: "RLC Exclusive COPO Camaro", year: 2021, series: "Convention Exclusive" },
  { name: "McLaren P1", year: 2013, series: "Premium" },
  { name: "Dodge Viper SRT10 ACR", year: 2008, series: "Mainline" },
  { name: "Mazda RX-7", year: 1978, series: "Mainline" },
  { name: "Honda Civic EG", year: 1992, series: "Mainline" },
  { name: "Subaru WRX STI", year: 2005, series: "Mainline" },
  { name: "Mitsubishi Lancer Evolution", year: 2003, series: "Mainline" },
  { name: "1957 Chevy", year: 1957, series: "Classic" },
  { name: "'67 Chevelle SS 396", year: 1967, series: "Classic" },
  { name: "Volkswagen Bug", year: 1973, series: "Classic" },
  { name: "Hot Bird", year: 1980, series: "Classic" },
  { name: "Rodger Dodger", year: 1974, series: "Classic" },
  { name: "Speed Blur", year: 2022, series: "Premium" },
  { name: "Rivited", year: 2023, series: "Mainline" },
  { name: "Audi R8 Spyder", year: 2010, series: "Mainline" },
  { name: "Mercedes-Benz SLS AMG", year: 2010, series: "Premium" },
  { name: "Ferrari 250 GTO", year: 1962, series: "Premium" },
  { name: "Ford F-150 SVT Raptor", year: 2011, series: "Mainline" },
  { name: "Jeep Scrambler", year: 1982, series: "Mainline" },
  { name: "Land Rover Defender 90", year: 1994, series: "Mainline" },
  { name: "Baja Blazer", year: 2003, series: "Mainline" },
  { name: "Twin Mill III", year: 2005, series: "Mainline" },
];

router.get("/models/search", async (req, res): Promise<void> => {
  const parsed = SearchModelsQueryParams.safeParse(req.query);
  if (!parsed.success || !parsed.data.q) {
    res.json([]);
    return;
  }

  const q = parsed.data.q.toLowerCase().trim();
  if (q.length < 2) {
    res.json([]);
    return;
  }

  const results = HOT_WHEELS_MODELS
    .filter(m => m.name.toLowerCase().includes(q))
    .slice(0, 8)
    .map(m => ({ name: m.name, year: m.year, series: m.series }));

  res.json(results);
});

export default router;
