import { findDoctorsTool } from "./doctor.tool.js";
import { findSlotsTool } from "./slot.tool.js";

import {
  bookAppointmentTool,
  getAppointmentTool,
  cancelAppointmentTool,
  rescheduleAppointmentTool,
} from "./appointment.tool.js";

export const tools = {
  find_doctors: findDoctorsTool,
  find_slots: findSlotsTool,
  book_appointment: bookAppointmentTool,
  get_appointment: getAppointmentTool,
  cancel_appointment: cancelAppointmentTool,
  reschedule_appointment: rescheduleAppointmentTool,
};
