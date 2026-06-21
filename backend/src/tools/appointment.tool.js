import {
  createAppointmentService,
  cancelAppointmentService,
  rescheduleAppointmentService,
  getAppointmentByIdService,
} from "../services/appointment.service.js";

// Book Appointment Tool
export const bookAppointmentTool = async (payload) => {
  return await createAppointmentService(payload);
};

// Get Appointment Tool
export const getAppointmentTool = async (appointmentId) => {
  return await getAppointmentByIdService(appointmentId);
};

// Cancel Appointment Tool
export const cancelAppointmentTool = async (appointmentId) => {
  return await cancelAppointmentService(appointmentId);
};

// Reschedule Tool
export const rescheduleAppointmentTool = async ({
  appointmentId,
  newSlotId,
}) => {
  return await rescheduleAppointmentService(appointmentId, newSlotId);
};
