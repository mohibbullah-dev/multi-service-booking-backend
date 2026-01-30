import Booking from "../models/Booking.js";
import Service from "../models/Service.js";

export async function createBooking(req, res) {
  const { serviceId, startAt } = req.body;

  if (!serviceId || !startAt) {
    return res
      .status(400)
      .json({ message: "serviceId and startAt are required" });
  }

  const service = await Service.findById(serviceId);
  if (!service || !service.isActive) {
    return res.status(404).json({ message: "Service not found" });
  }

  const startDate = new Date(startAt);
  if (Number.isNaN(startDate.getTime())) {
    return res.status(400).json({ message: "Invalid startAt date" });
  }

  // Optional simple conflict check (same service exact start time)
  const existing = await Booking.findOne({
    serviceId,
    startAt: startDate,
    status: { $ne: "cancelled" },
  });
  if (existing) {
    return res.status(409).json({ message: "This slot is already booked" });
  }

  const booking = await Booking.create({
    userId: req.userId,
    serviceId,
    startAt: startDate,
  });

  res.status(201).json({ booking });
}

export async function myBookings(req, res) {
  const bookings = await Booking.find({ userId: req.userId })
    .populate("serviceId", "title durationMins price")
    .sort({ createdAt: -1 });

  res.json({ bookings });
}
