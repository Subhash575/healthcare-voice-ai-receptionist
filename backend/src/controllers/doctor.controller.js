import { getDoctorsService } from "../services/doctor.service.js";

export const getDoctors = async (req, res) => {
  try {
    const { specialty } = req.query;

    const doctors = await getDoctorsService(specialty);

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
    });
  }
};
