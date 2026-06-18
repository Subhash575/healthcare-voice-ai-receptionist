import express from "express";
import doctorRoutes from "./routes/doctor.routes.js";
import slotRoutes from "./routes/slot.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";

const app = express();

app.use(express.json());

app.use("/api/doctors", doctorRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/appointments", appointmentRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("server start at port:3000");
});

export default app;
