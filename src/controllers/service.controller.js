import Service from "../models/Service.js";

export async function listServices(req, res) {
  const services = await Service.find({ isActive: true }).sort({
    createdAt: -1,
  });
  res.json({ services });
}

export async function createService(req, res) {
  const { title, description = "", durationMins, price } = req.body;

  if (!title || !durationMins || price === undefined) {
    return res
      .status(400)
      .json({ message: "title, durationMins, price are required" });
  }

  const service = await Service.create({
    title,
    description,
    durationMins: Number(durationMins),
    price: Number(price),
  });

  res.status(201).json({ service });
}

export async function updateService(req, res) {
  const { id } = req.params;

  const updates = {};
  const allowed = ["title", "description", "durationMins", "price", "isActive"];
  for (const k of allowed) {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  }

  if (updates.durationMins !== undefined)
    updates.durationMins = Number(updates.durationMins);
  if (updates.price !== undefined) updates.price = Number(updates.price);

  const service = await Service.findByIdAndUpdate(id, updates, { new: true });
  if (!service) return res.status(404).json({ message: "Service not found" });

  res.json({ service });
}

export async function deleteService(req, res) {
  const { id } = req.params;

  // soft delete (recommended)
  const service = await Service.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  if (!service) return res.status(404).json({ message: "Service not found" });

  res.json({ ok: true });
}

export async function getServiceById(req, res) {
  const { id } = req.params;

  const service = await Service.findById(id);
  if (!service || !service.isActive) {
    return res.status(404).json({ message: "Service not found" });
  }

  res.json({ service });
}
