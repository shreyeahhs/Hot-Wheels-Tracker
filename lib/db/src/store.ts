import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";

export interface AdminRecord {
  id: number;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

export interface CarRecord {
  id: number;
  name: string;
  year: number;
  series: string;
  color: string;
  imageUrl: string | null;
  description: string | null;
  rarity: string;
  dateAdded: Date;
}

export interface MessageRecord {
  id: number;
  name: string;
  email: string;
  message: string;
  timestamp: Date;
}

export interface WishlistRecord {
  id: number;
  name: string;
  year: number | null;
  series: string | null;
  notes: string | null;
  dateAdded: Date;
}

type SerializedAdminRecord = Omit<AdminRecord, "createdAt"> & { createdAt: string };
type SerializedCarRecord = Omit<CarRecord, "dateAdded"> & { dateAdded: string };
type SerializedMessageRecord = Omit<MessageRecord, "timestamp"> & { timestamp: string };
type SerializedWishlistRecord = Omit<WishlistRecord, "dateAdded"> & { dateAdded: string };

interface SerializedStore {
  nextIds: {
    admin: number;
    cars: number;
    messages: number;
    wishlist: number;
  };
  admins: SerializedAdminRecord[];
  cars: SerializedCarRecord[];
  messages: SerializedMessageRecord[];
  wishlist: SerializedWishlistRecord[];
}

interface RuntimeStore {
  nextIds: SerializedStore["nextIds"];
  admins: AdminRecord[];
  cars: CarRecord[];
  messages: MessageRecord[];
  wishlist: WishlistRecord[];
}

export interface NewCarInput {
  name: string;
  year: number;
  series: string;
  color: string;
  imageUrl?: string | null;
  description?: string | null;
  rarity: string;
}

export interface UpdateCarInput {
  name?: string;
  year?: number;
  series?: string;
  color?: string;
  imageUrl?: string | null;
  description?: string | null;
  rarity?: string;
}

export interface NewMessageInput {
  name: string;
  email: string;
  message: string;
}

export interface NewWishlistInput {
  name: string;
  year?: number | null;
  series?: string | null;
  notes?: string | null;
}

const runtimeDir = process.env.HWV_DATA_DIR
  ? path.resolve(process.env.HWV_DATA_DIR)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "data", "runtime");
const dataFile = path.join(runtimeDir, "hot-wheels-vault.json");
const defaultAdminPassword = process.env.HWV_ADMIN_PASSWORD ?? "admin1234";
const defaultAdminUsername = process.env.HWV_ADMIN_USERNAME ?? "admin";

let cachedStore: RuntimeStore | null = null;

function getSeedStore(): RuntimeStore {
  const adminPasswordHash = bcrypt.hashSync(defaultAdminPassword, 10);
  const now = new Date();

  return {
    nextIds: {
      admin: 2,
      cars: 7,
      messages: 1,
      wishlist: 1,
    },
    admins: [
      {
        id: 1,
        username: defaultAdminUsername,
        passwordHash: adminPasswordHash,
        createdAt: now,
      },
    ],
    cars: [
      {
        id: 1,
        name: "Twin Mill",
        year: 1969,
        series: "Classic",
        color: "Orange",
        imageUrl: null,
        description: "A legendary twin-engine Hot Wheels icon.",
        rarity: "Mainline",
        dateAdded: now,
      },
      {
        id: 2,
        name: "Bone Shaker",
        year: 2006,
        series: "Mainline",
        color: "Black",
        imageUrl: null,
        description: "Skull-front hot rod with a long-running fanbase.",
        rarity: "Mainline",
        dateAdded: now,
      },
      {
        id: 3,
        name: "Dodge Charger",
        year: 1969,
        series: "Classic",
        color: "Red",
        imageUrl: null,
        description: "Muscle-car classic and a staple for any collection.",
        rarity: "Premium",
        dateAdded: now,
      },
      {
        id: 4,
        name: "Porsche 911 GT3 RS",
        year: 2016,
        series: "Premium",
        color: "Green",
        imageUrl: null,
        description: "Track-ready supercar in miniature form.",
        rarity: "Premium",
        dateAdded: now,
      },
      {
        id: 5,
        name: "Custom '67 Pontiac Firebird",
        year: 2019,
        series: "Treasure Hunt",
        color: "Purple",
        imageUrl: null,
        description: "Treasure Hunt favorite with collector appeal.",
        rarity: "Treasure Hunt",
        dateAdded: now,
      },
      {
        id: 6,
        name: "RLC Exclusive COPO Camaro",
        year: 2021,
        series: "Convention Exclusive",
        color: "Blue",
        imageUrl: null,
        description: "A limited release for serious collectors.",
        rarity: "Convention Exclusive",
        dateAdded: now,
      },
    ],
    messages: [],
    wishlist: [],
  };
}

function toSerializedStore(store: RuntimeStore): SerializedStore {
  return {
    nextIds: store.nextIds,
    admins: store.admins.map((admin) => ({
      ...admin,
      createdAt: admin.createdAt.toISOString(),
    })),
    cars: store.cars.map((car) => ({
      ...car,
      dateAdded: car.dateAdded.toISOString(),
    })),
    messages: store.messages.map((message) => ({
      ...message,
      timestamp: message.timestamp.toISOString(),
    })),
    wishlist: store.wishlist.map((item) => ({
      ...item,
      dateAdded: item.dateAdded.toISOString(),
    })),
  };
}

function toRuntimeStore(store: SerializedStore): RuntimeStore {
  return {
    nextIds: store.nextIds,
    admins: store.admins.map((admin) => ({
      ...admin,
      createdAt: new Date(admin.createdAt),
    })),
    cars: store.cars.map((car) => ({
      ...car,
      dateAdded: new Date(car.dateAdded),
    })),
    messages: store.messages.map((message) => ({
      ...message,
      timestamp: new Date(message.timestamp),
    })),
    wishlist: store.wishlist.map((item) => ({
      ...item,
      dateAdded: new Date(item.dateAdded),
    })),
  };
}

function ensureStoreFile(): RuntimeStore {
  if (cachedStore) {
    return cachedStore;
  }

  fs.mkdirSync(runtimeDir, { recursive: true });

  if (!fs.existsSync(dataFile)) {
    cachedStore = getSeedStore();
    fs.writeFileSync(dataFile, JSON.stringify(toSerializedStore(cachedStore), null, 2));
    return cachedStore;
  }

  const raw = fs.readFileSync(dataFile, "utf8");
  if (!raw.trim()) {
    cachedStore = getSeedStore();
    fs.writeFileSync(dataFile, JSON.stringify(toSerializedStore(cachedStore), null, 2));
    return cachedStore;
  }

  cachedStore = toRuntimeStore(JSON.parse(raw) as SerializedStore);
  return cachedStore;
}

function persistStore(store: RuntimeStore): void {
  cachedStore = store;
  fs.mkdirSync(runtimeDir, { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(toSerializedStore(store), null, 2));
}

function cloneRuntimeStore(store: RuntimeStore): RuntimeStore {
  return {
    nextIds: { ...store.nextIds },
    admins: store.admins.map((admin) => ({ ...admin, createdAt: new Date(admin.createdAt) })),
    cars: store.cars.map((car) => ({ ...car, dateAdded: new Date(car.dateAdded) })),
    messages: store.messages.map((message) => ({ ...message, timestamp: new Date(message.timestamp) })),
    wishlist: store.wishlist.map((item) => ({ ...item, dateAdded: new Date(item.dateAdded) })),
  };
}

export function getAdminByUsername(username: string): AdminRecord | undefined {
  return ensureStoreFile().admins.find((admin) => admin.username === username);
}

export function listCars(): CarRecord[] {
  return cloneRuntimeStore(ensureStoreFile()).cars;
}

export function getCarById(id: number): CarRecord | undefined {
  return ensureStoreFile().cars.find((car) => car.id === id);
}

export function createCar(input: NewCarInput): CarRecord {
  const store = cloneRuntimeStore(ensureStoreFile());
  const car: CarRecord = {
    id: store.nextIds.cars++,
    name: input.name,
    year: input.year,
    series: input.series,
    color: input.color,
    imageUrl: input.imageUrl ?? null,
    description: input.description ?? null,
    rarity: input.rarity,
    dateAdded: new Date(),
  };

  store.cars.push(car);
  persistStore(store);
  return car;
}

export function updateCar(id: number, input: UpdateCarInput): CarRecord | undefined {
  const store = cloneRuntimeStore(ensureStoreFile());
  const car = store.cars.find((entry) => entry.id === id);
  if (!car) {
    return undefined;
  }

  if (input.name !== undefined) car.name = input.name;
  if (input.year !== undefined) car.year = input.year;
  if (input.series !== undefined) car.series = input.series;
  if (input.color !== undefined) car.color = input.color;
  if (input.imageUrl !== undefined) car.imageUrl = input.imageUrl;
  if (input.description !== undefined) car.description = input.description;
  if (input.rarity !== undefined) car.rarity = input.rarity;

  persistStore(store);
  return car;
}

export function deleteCar(id: number): CarRecord | undefined {
  const store = cloneRuntimeStore(ensureStoreFile());
  const index = store.cars.findIndex((car) => car.id === id);
  if (index === -1) {
    return undefined;
  }

  const [removed] = store.cars.splice(index, 1);
  persistStore(store);
  return removed;
}

export function listMessages(): MessageRecord[] {
  return cloneRuntimeStore(ensureStoreFile()).messages;
}

export function createMessage(input: NewMessageInput): MessageRecord {
  const store = cloneRuntimeStore(ensureStoreFile());
  const message: MessageRecord = {
    id: store.nextIds.messages++,
    name: input.name,
    email: input.email,
    message: input.message,
    timestamp: new Date(),
  };

  store.messages.push(message);
  persistStore(store);
  return message;
}

export function listWishlist(): WishlistRecord[] {
  return cloneRuntimeStore(ensureStoreFile()).wishlist;
}

export function createWishlistItem(input: NewWishlistInput): WishlistRecord {
  const store = cloneRuntimeStore(ensureStoreFile());
  const item: WishlistRecord = {
    id: store.nextIds.wishlist++,
    name: input.name,
    year: input.year ?? null,
    series: input.series ?? null,
    notes: input.notes ?? null,
    dateAdded: new Date(),
  };

  store.wishlist.push(item);
  persistStore(store);
  return item;
}

export function deleteWishlistItem(id: number): WishlistRecord | undefined {
  const store = cloneRuntimeStore(ensureStoreFile());
  const index = store.wishlist.findIndex((item) => item.id === id);
  if (index === -1) {
    return undefined;
  }

  const [removed] = store.wishlist.splice(index, 1);
  persistStore(store);
  return removed;
}
