import { createAppointmentService } from "../services/appointment.service.js";
import { getAppointmentByIdService } from "../services/appointment.service.js";
import { cancelAppointmentService } from "../services/appointment.service.js";
import { rescheduleAppointmentService } from "../services/appointment.service.js";

// POST
export const createAppointment = async (req, res) => {
  try {
    const { slotId, patientName, phone, email } = req.body;

    if (!slotId || !patientName || !phone) {
      return res.status(400).json({
        success: false,
        message: "slotId, patientName and phone are required",
      });
    }

    const result = await createAppointmentService({
      slotId,
      patientName,
      phone,
      email,
    });

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: result.data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create appointment",
    });
  }
};

// GET
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getAppointmentByIdService(id);

    if (!result.success) {
      return res.status(result.statusCode).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointment",
    });
  }
};

//PATCH:- It means update appointment here.
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await cancelAppointmentService(id);

    if (!result.success) {
      return res.status(result.statusCode).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel appointment",
    });
  }
};

// PATCH reschedule controller.
export const rescheduleAppointment = async (req, res) => {
  try {
    // This id is the appointment Id
    const { id } = req.params;
    const { newSlotId } = req.body;

    if (!newSlotId) {
      return res.status(400).json({
        success: false,
        message: "newSlotId is required",
      });
    }

    const result = await rescheduleAppointmentService(id, newSlotId);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to reschedule appointment",
    });
  }
};
