import { getDoctorsService } from "../services/doctor.service.js";

export const findDoctorsTool = async ({ specialty }) => {
  const doctors = await getDoctorsService(specialty);

  return doctors;
};
