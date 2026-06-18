import { prisma } from "../lib/prisma.js";
import { SlotStatus, AppointmentStatus } from "@prisma/client";

// POST service
export const createAppointmentService = async ({
  slotId,
  patientName,
  phone,
  email,
}) => {
  // 1. Check if slot exists
  const slot = await prisma.slot.findUnique({
    where: {
      id: Number(slotId),
    },
  });

  if (!slot) {
    return {
      success: false,
      statusCode: 404,
      message: "Slot not found",
    };
  }

  // 2. Check if slot is available
  if (slot.status !== SlotStatus.AVAILABLE) {
    return {
      success: false,
      statusCode: 409,
      message: "Selected slot is no longer available",
    };
  }

  // 3. Find existing patient by phone
  let patient = await prisma.patient.findUnique({
    where: {
      phone,
    },
  });

  // 4. Create patient if doesn't exist
  if (!patient) {
    patient = await prisma.patient.create({
      data: {
        name: patientName,
        phone,
        email,
      },
    });
  }

  // 5. Transaction
  const appointment = await prisma.$transaction(async (tx) => {
    // Re-check slot inside transaction
    const currentSlot = await tx.slot.findUnique({
      where: {
        id: Number(slotId),
      },
    });

    if (!currentSlot || currentSlot.status !== SlotStatus.AVAILABLE) {
      throw new Error("Selected slot is no longer available");
    }

    // Create appointment
    const appointment = await tx.appointment.create({
      data: {
        patientId: patient.id,
        slotId: currentSlot.id,
        status: AppointmentStatus.CONFIRMED,
      },
      include: {
        patient: true,
        slot: true,
      },
    });

    // Update slot status
    await tx.slot.update({
      where: {
        id: currentSlot.id,
      },
      data: {
        status: SlotStatus.BOOKED,
      },
    });

    return appointment;
  });

  return {
    success: true,
    data: {
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      patientName: appointment.patient.name,
      slotId: appointment.slotId,
      appointmentStatus: appointment.status,
      startTime: appointment.slot.startTime,
    },
  };
};

// GET service by Id
export const getAppointmentByIdService = async (appointmentId) => {
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: Number(appointmentId),
    },

    include: {
      patient: true,
      slot: {
        include: {
          doctor: true,
        },
      },
    },
  });

  if (!appointment) {
    return {
      success: false,
      statusCode: 404,
      message: "Appointment not found",
    };
  }

  return {
    success: true,
    data: appointment,
  };
};

// PATCH service(update) using appointement Id
export const cancelAppointmentService = async (appointmentId) => {
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: Number(appointmentId),
    },
  });

  if (!appointment) {
    return {
      success: false,
      statusCode: 404,
      message: "Appointment not found",
    };
  }

  if (appointment.status === AppointmentStatus.CANCELLED) {
    return {
      success: false,
      statusCode: 400,
      message: "Appointment is already cancelled",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.appointment.update({
      where: {
        id: Number(appointmentId),
      },

      data: {
        status: AppointmentStatus.CANCELLED,
      },
    });

    const activeAppointments = await tx.appointment.count({
      where: {
        slotId: appointment.slotId,
        status: {
          notIn: [AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED],
          //Anything not cancelled or completed is active
        },
      },
    });
    if (activeAppointments === 0) {
      await tx.slot.update({
        where: {
          id: appointment.slotId,
        },
        data: {
          status: SlotStatus.AVAILABLE,
        },
      });
    }
  });

  return {
    success: true,
    message: "Appointment cancelled successfully",
  };
};

// PATCH reschedule the old appointment:-
export const rescheduleAppointmentService = async (
  appointmentId,
  newSlotId,
) => {
  // From previous appointment_id get the previous appointment detail.
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: Number(appointmentId),
    },
  });

  if (!appointment) {
    return {
      success: false,
      statusCode: 404,
      message: "Appointment not found",
    };
  }

  const newSlot = await prisma.slot.findUnique({
    where: {
      id: Number(newSlotId),
    },
  });

  if (!newSlot) {
    return {
      success: false,
      statusCode: 404,
      message: "New slot not found",
    };
  }

  if (newSlot.status !== SlotStatus.AVAILABLE) {
    return {
      success: false,
      statusCode: 409,
      message: "Selected slot is not available",
    };
  }

  await prisma.$transaction(async (tx) => {
    // Made previous slot available
    await tx.slot.update({
      where: {
        id: appointment.slotId,
      },

      data: {
        status: SlotStatus.AVAILABLE,
      },
    });

    // And booked the new slot
    await tx.slot.update({
      where: {
        id: Number(newSlotId),
      },

      data: {
        status: SlotStatus.BOOKED,
      },
    });

    // Update the sloId with new slotId in previous appointment.
    await tx.appointment.update({
      where: {
        id: Number(appointmentId),
      },

      data: {
        slotId: Number(newSlotId),

        status: AppointmentStatus.RESCHEDULED,
      },
    });
  });

  return {
    success: true,
    message: "Appointment rescheduled successfully",
  };
};
