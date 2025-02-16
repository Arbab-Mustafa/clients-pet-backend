import Appointment from "../models/Appointment.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

export const createAppointment = async (req, res) => {
  try {
    console.log("🔍 Received Request:", req.body); // ✅ Log request body

    const { petName, date, description } = req.body;

    if (!petName || !date) {
      console.log("❌ Missing required fields:", { petName, date });
      return res
        .status(400)
        .json({ success: false, message: "Pet name and date are required" });
    }

    const appointment = new Appointment({
      petName,
      date,
      description,
      owner: req.user.id,
    });
    await appointment.save();

    console.log("✅ Appointment Created:", appointment);
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    console.error("❌ Error Creating Appointment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAppointments = async (req, res) => {
  const query = req.user.role === "admin" ? {} : { owner: req.user._id };
  const appointments = await Appointment.find(query).populate(
    "owner",
    "name email"
  );
  successResponse(res, "Appointments retrieved", appointments);
};
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { petName, date, description } = req.body;

    let appointment = await Appointment.findById(id);
    if (!appointment) return errorResponse(res, "Appointment not found", 404);

    // Allow only owner or admin to update
    if (
      req.user.role !== "admin" &&
      appointment.owner.toString() !== req.user._id.toString()
    ) {
      return errorResponse(
        res,
        "Unauthorized: You can only update your own appointments",
        403
      );
    }

    // Update appointment fields
    appointment.petName = petName || appointment.petName;
    appointment.date = date || appointment.date;
    appointment.description = description || appointment.description;

    await appointment.save();
    successResponse(res, "Appointment updated successfully", appointment);
  } catch (error) {
    errorResponse(res, "Error updating appointment", 500);
  }
};
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    let appointment = await Appointment.findById(id);
    if (!appointment) return errorResponse(res, "Appointment not found", 404);

    // Allow only owner or admin to delete
    if (
      req.user.role !== "admin" &&
      appointment.owner.toString() !== req.user._id.toString()
    ) {
      return errorResponse(
        res,
        "Unauthorized: You can only delete your own appointments",
        403
      );
    }

    await appointment.deleteOne();
    successResponse(res, "Appointment deleted successfully");
  } catch (error) {
    errorResponse(res, "Error deleting appointment", 500);
  }
};
