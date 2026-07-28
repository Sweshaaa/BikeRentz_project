import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../database/mongodb";
import User from "../models/User";
import Bike from "../models/Bike";
import { BikeType, BikeCategory } from "../types/bike.type";

interface FleetItem {
  name: string;
  brand: string;
  type: BikeType;
  category: BikeCategory;
  pricePerDay: number;
  engineCC?: number;
  motorPowerWatts?: number;
  description: string;
  image: string;
}

async function seed() {
  await connectDB();

  let admin = await User.findOne({ email: "admin@bikerentz.com" });
  if (!admin) {
    const hashed = await bcrypt.hash("Admin@123", 10);
    admin = await User.create({
      name: "BikeRentz Admin",
      email: "admin@bikerentz.com",
      password: hashed,
      role: "admin",
      isVerified: true,
    });
    console.log("Created admin user: admin@bikerentz.com / Admin@123");
  }

  const fleet: FleetItem[] = [
    {
      name: "Duke 390",
      brand: "KTM",
      type: "Motorbike",
      category: "Sports",
      pricePerDay: 2500,
      engineCC: 373,
      description: "Aggressive naked sportbike, perfect for weekend rides.",
      image: "/bikes/duke-390.jpg",
    },
    {
      name: "Classic 350",
      brand: "Royal Enfield",
      type: "Motorbike",
      category: "Cruiser",
      pricePerDay: 1800,
      engineCC: 349,
      description: "Timeless cruiser with a thumping single-cylinder engine.",
      image: "/bikes/classic-350.jpg",
    },
    {
      name: "Activa 6G",
      brand: "Honda",
      type: "Scooter",
      category: "Commuter",
      pricePerDay: 900,
      engineCC: 110,
      description: "Reliable everyday scooter, easy to ride around the city.",
      image: "/bikes/activa-6g.jpg",
    },
    {
      name: "Himalayan",
      brand: "Royal Enfield",
      type: "Motorbike",
      category: "Adventure/Touring",
      pricePerDay: 2200,
      engineCC: 411,
      description: "Built for long-distance touring and rough terrain.",
      image: "/bikes/himalayan.jpg",
    },
    {
      name: "NTorq 125",
      brand: "TVS",
      type: "Scooter",
      category: "Sports",
      pricePerDay: 1100,
      engineCC: 125,
      description: "Sporty scooter with a digital console and peppy performance.",
      image: "/bikes/ntorq-125.jpg",
    },
    {
      name: "Ather 450X",
      brand: "Ather",
      type: "Electric Scooter",
      category: "Electric",
      pricePerDay: 1500,
      motorPowerWatts: 6400,
      description: "Fast, connected electric scooter with a long range.",
      image: "/bikes/ather-450x.jpg",
    },
  ];

  for (const bike of fleet) {
    const exists = await Bike.findOne({ name: bike.name, brand: bike.brand });
    if (!exists) {
      await Bike.create({ ...bike, addedBy: admin._id, status: "AVAILABLE" });
    } else if (exists.image !== bike.image) {
      exists.image = bike.image;
      await exists.save();
    }
  }

  console.log(`Seeded fleet with ${fleet.length} bikes`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
