import { prisma } from "../src/lib/prisma.js";

const DAY_MAP = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function generateTimeSlots(date) {
  const slots = [];

  // Morning: 9 AM - 1 PM
  let current = new Date(date);
  current.setHours(9, 0, 0, 0);

  const morningEnd = new Date(date);
  morningEnd.setHours(13, 0, 0, 0);

  while (current < morningEnd) {
    slots.push(new Date(current));
    current.setMinutes(current.getMinutes() + 15);
  }

  // Afternoon: 2 PM - 6 PM
  current = new Date(date);
  current.setHours(14, 0, 0, 0);

  const eveningEnd = new Date(date);
  eveningEnd.setHours(18, 0, 0, 0);

  while (current < eveningEnd) {
    slots.push(new Date(current));
    current.setMinutes(current.getMinutes() + 15);
  }

  return slots;
}

async function main() {
  const doctors = await prisma.doctor.findMany();

  const slotsToCreate = [];

  for (const doctor of doctors) {
    const workingDays =
      doctor.workingDays?.split(",").map((d) => DAY_MAP[d.trim()]) || [];

    const days = Number(process.env.SLOT_GENERATION_DAYS);
    for (let i = 0; i < days; i++) {
      const currentDate = new Date();

      currentDate.setDate(currentDate.getDate() + i);

      const dayOfWeek = currentDate.getDay();

      if (!workingDays.includes(dayOfWeek)) {
        continue;
      }

      const timeSlots = generateTimeSlots(currentDate);

      for (const slot of timeSlots) {
        slotsToCreate.push({
          doctorId: doctor.id,
          startTime: slot,
        });
      }
    }
  }

  await prisma.slot.createMany({
    data: slotsToCreate,
    skipDuplicates: true,
  });

  console.log(`Created ${slotsToCreate.length} slots`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
