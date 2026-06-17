import { getAvailableSlotsService } from "../services/slot.service.js";

export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: "doctorId and date are required",
      });
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    const result = await getAvailableSlotsService(doctorId, date);
    if (result.doctorNotFound) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (result.found) {
      return res.status(200).json({
        success: true,
        count: result.slots.length,
        data: result.slots,
      });
    }

    return res.status(200).json({
      success: true,
      count: 0,
      message: "No slots available on requested date",
      nextAvailableSlot: result.alternativeSlots[0]?.startTime ?? null,
      suggestedSlots: result.alternativeSlots,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch slots",
    });
  }
};
