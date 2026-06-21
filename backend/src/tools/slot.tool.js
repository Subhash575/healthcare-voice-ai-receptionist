import { getAvailableSlotsService } from "../services/slot.service.js";

export const findSlotsTool = async ({ doctorId, date }) => {
  return await getAvailableSlotsService(doctorId, date);
};
