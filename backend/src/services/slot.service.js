import { prisma } from "../lib/prisma.js";
import { SlotStatus } from "@prisma/client";

// Here we use the helper function to fetch the next 7 day slot.
const findNextAvailableSlots = async (doctorId, requestedDate) => {
  const startDate = new Date(requestedDate);

  const endDate = new Date(requestedDate);

  endDate.setDate(endDate.getDate() + 7);

  return prisma.slot.findMany({
    where: {
      doctorId: Number(doctorId),

      status: SlotStatus.AVAILABLE,

      startTime: {
        gt: startDate,
        lt: endDate,
      },
    },

    orderBy: {
      startTime: "asc",
    },

    take: 5,

    select: {
      id: true,
      startTime: true,
    },
  });
};

export const getAvailableSlotsService = async (doctorId, date) => {
  const startDate = new Date(date);

  const endDate = new Date(date);

  endDate.setDate(endDate.getDate() + 1);

  //checking doctor exist or not.
  const doctor = await prisma.doctor.findUnique({
    where: {
      id: Number(doctorId),
    },
  });

  if (!doctor) {
    return {
      doctorNotFound: true,
    };
  }

  const slots = await prisma.slot.findMany({
    where: {
      doctorId: Number(doctorId),

      status: SlotStatus.AVAILABLE,

      startTime: {
        gte: startDate,
        lt: endDate,
      },
    },

    orderBy: {
      startTime: "asc",
    },

    select: {
      id: true,
      startTime: true,
    },
  });

  if (slots.length > 0) {
    return {
      found: true,
      slots,
    };
  }

  const alternativeSlots = await findNextAvailableSlots(doctorId, date);

  return {
    found: false,
    alternativeSlots,
  };
};
