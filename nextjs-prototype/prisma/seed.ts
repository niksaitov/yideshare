import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.ride.create({
    data: {
      ownerName: "Lena Qian",
      ownerPhone: "555-1234",
      beginning: "Yale",
      destination: "Hartford",
      description: "Test ride",
      startTime: new Date(),
      endTime: new Date(),
      totalSeats: 4,
      currentTakenSeats: 0,
      isClosed: false,
    },
  });

  console.log("Seed data added.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
