import { prisma } from "../lib/prisma.js";

export const getDoctorsService = async (specialty) => {
  const where = specialty
    ? {
        specialty: {
          contains: specialty,
          mode: "insensitive",
        },
      }
    : {};

  return prisma.doctor.findMany({
    where,
    orderBy: {
      name: "asc",
    },
  });
};
