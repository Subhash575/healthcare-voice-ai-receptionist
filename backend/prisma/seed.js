import { prisma } from "../src/lib/prisma.js";

const doctors = [
  {
    name: "Dr. Babu Reddy T S",
    specialty: "Cardiology",
    workingDays: "Mon,Tue,Wed,Thu,Fri",
  },
  {
    name: "Dr. Shardamma N",
    specialty: "Gynecology",
    workingDays: "Mon,Wed,Fri",
  },
  {
    name: "Dr. Vijay C R Reddy",
    specialty: "General Surgery",
    workingDays: "Tue,Thu,Sat",
  },
  {
    name: "Dr. Mahesh Meda",
    specialty: "ENT",
    workingDays: "Mon,Tue,Wed,Thu,Fri",
  },
  {
    name: "Dr. Sambashiva AC",
    specialty: "General Medicine",
    workingDays: "Mon,Tue,Wed,Thu,Fri,Sat",
  },
  {
    name: "Dr. Aditya Patil",
    specialty: "Plastic Surgery",
    workingDays: "Tue,Thu",
  },
  {
    name: "Dr. Vikram T P",
    specialty: "Neurosurgery",
    workingDays: "Mon,Fri",
  },
  {
    name: "Dr. Vinod Nagesh",
    specialty: "Nephrology",
    workingDays: "Wed,Thu,Fri",
  },
  {
    name: "Dr. Srikanth V",
    specialty: "Urology",
    workingDays: "Mon,Tue,Wed",
  },
];

async function main() {
  await prisma.doctor.createMany({
    data: doctors,
    skipDuplicates: true,
  });

  console.log("Doctors seeded successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
