import dotenv from "dotenv";
import path from "path";
import fs from "fs/promises";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.resolve(process.cwd(), "..", ".env") });
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const reset = args.includes("--reset");

const getArgValue = (key, fallback = "all") => {
  const arg = args.find((item) => item.startsWith(`${key}=`));
  return arg ? arg.split("=")[1] : fallback;
};

const type = getArgValue("--type", "all");

const dataDir = path.resolve(process.cwd(), "data");
const readJson = async (fileName) => {
  const filePath = path.join(dataDir, fileName);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
};

const hashUsers = async (users) => {
  return Promise.all(
    users.map(async (user) => {
      const seedPassword = user.seedPassword || user.password;
      if (!seedPassword) {
        throw new Error(`Missing seedPassword/password for ${user.email}`);
      }

      const password = await bcrypt.hash(seedPassword, 10);
      return {
        ...user,
        password,
      };
    })
  );
};

const connect = async () => {
  if (dryRun) return;
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set.");
  }
  await mongoose.connect(process.env.MONGO_URI);
};

const seed = async () => {
  const tasks = [];
  if (type === "all" || type === "doctors") tasks.push({ role: "doctor", file: "doctors.json" });
  if (type === "all" || type === "patients") tasks.push({ role: "patient", file: "patients.json" });

  const summaries = [];

  for (const task of tasks) {
    const users = await readJson(task.file);
    const hashedUsers = await hashUsers(users);
    summaries.push({ role: task.role, count: hashedUsers.length });

    if (!dryRun) {
      if (reset) {
        await User.deleteMany({ role: task.role });
      }
      await User.insertMany(hashedUsers);
    }
  }

  return summaries;
};

const main = async () => {
  try {
    await connect();
    const summaries = await seed();

    console.log(
      dryRun
        ? "Dry run complete. No records were written."
        : `Seed complete${reset ? " (existing role records cleared first)" : ""}.`
    );
    for (const summary of summaries) {
      console.log(`${summary.role}: ${summary.count} records prepared${dryRun ? "" : " and inserted"}.`);
    }

    if (!dryRun) {
      await mongoose.disconnect();
    }
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  }
};

main();