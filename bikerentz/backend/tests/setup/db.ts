import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import "../../src/models/User";
import "../../src/models/Bike";
import "../../src/models/RentalOrder";
import "../../src/models/Notification";

let mongo: MongoMemoryServer;

export async function connectTestDB() {
  mongo = await MongoMemoryServer.create({
    binary: { systemBinary: "C:\\Program Files\\MongoDB\\Server\\8.2\\bin\\mongod.exe" },
  });
  const uri = mongo.getUri();
  await mongoose.connect(uri);
}

export async function clearTestDB() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

export async function disconnectTestDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
}
