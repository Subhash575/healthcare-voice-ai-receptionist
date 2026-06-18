import express from "express";
import {
  createAppointment,
  getAppointmentById,
  cancelAppointment,
  rescheduleAppointment,
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/", createAppointment);

router.get("/:id", getAppointmentById);

router.patch("/:id/cancel", cancelAppointment);

router.patch("/:id/reschedule", rescheduleAppointment);

export default router;
