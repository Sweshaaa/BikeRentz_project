import "./env";

import cron from "node-cron";
import app from "./app";
import { connectDB } from "./database/mongodb";
import { RentalService } from "./services/rental.service";

const PORT = process.env.PORT || 5000;
const rentalService = new RentalService();

async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`BikeRentz API running on port ${PORT}`);
  });

  // Every hour: auto-complete rentals whose end date has passed and free up the bike
  cron.schedule("0 * * * *", async () => {
    const count = await rentalService.completeExpiredRentals();
    if (count > 0) console.log(`Auto-completed ${count} expired rental(s)`);
  });
}

start();
