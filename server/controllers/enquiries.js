import prisma from "../lib/prisma.js";

// In-memory fallback storage for offline dev/demo
let fallbackEnquiries = [
  {
    id: "enq-1",
    propertyId: "p1",
    name: "Arjun Verma",
    phone: "+91 98401 23456",
    email: "arjun.v@example.com",
    message: "Hi, is this Besant Nagar flat available for viewing this Saturday?",
    type: "SITE_VISIT",
    visitDate: "Saturday, 11:00 AM",
    visitTime: "Morning (10 AM - 12 PM)",
    status: "NEW",
    replyMessage: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    property: {
      id: "p1",
      title: "Sunlit 3BHK near Besant Nagar Beach",
      price: "₹1.85 Cr",
      location: "Besant Nagar, Chennai",
    },
  },
  {
    id: "enq-2",
    propertyId: "p2",
    name: "Priya Sundaram",
    phone: "+91 97890 54321",
    email: "priya.s@example.com",
    message: "Interested in the 2BHK in Velachery. Are pets allowed?",
    type: "MESSAGE",
    status: "REPLIED",
    replyMessage: "Yes, small pets are permitted with HOA registration.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    property: {
      id: "p2",
      title: "Compact 2BHK with terrace garden",
      price: "₹78 L",
      location: "Velachery, Chennai",
    },
  },
];

export async function createEnquiry(req, res) {
  try {
    const { propertyId, name, phone, email, message, userId, type = "MESSAGE", visitDate, visitTime } = req.body;

    if (!propertyId || !name || !phone) {
      return res.status(400).json({ error: "Property ID, name, and phone number are required." });
    }

    try {
      const enquiry = await prisma.enquiry.create({
        data: {
          propertyId,
          name,
          phone,
          email: email || null,
          message: message || null,
          userId: userId || null,
          type: type || "MESSAGE",
          visitDate: visitDate || null,
          visitTime: visitTime || null,
          status: "NEW",
        },
        include: {
          property: {
            select: { id: true, title: true, price: true, location: true },
          },
        },
      });

      return res.status(201).json({ enquiry, message: "Enquiry submitted successfully." });
    } catch (dbErr) {
      console.warn("DB write failed in createEnquiry, using in-memory store:", dbErr.message);
      const newEnquiry = {
        id: `enq-${Date.now()}`,
        propertyId,
        name,
        phone,
        email: email || null,
        message: message || null,
        userId: userId || null,
        type: type || "MESSAGE",
        visitDate: visitDate || null,
        visitTime: visitTime || null,
        status: "NEW",
        replyMessage: null,
        createdAt: new Date().toISOString(),
        property: {
          id: propertyId,
          title: "Property Listing",
          price: "Price on request",
          location: "Chennai",
        },
      };
      fallbackEnquiries.unshift(newEnquiry);
      return res.status(201).json({ enquiry: newEnquiry, message: "Enquiry submitted successfully." });
    }
  } catch (error) {
    console.error("Error creating enquiry:", error);
    return res.status(500).json({ error: "Failed to submit enquiry", details: error.message });
  }
}

export async function listEnquiries(req, res) {
  try {
    const { propertyId, userId, ownerId, status } = req.query;

    try {
      const where = {};
      if (propertyId) where.propertyId = propertyId;
      if (userId) where.userId = userId;
      if (status) where.status = status;
      if (ownerId) where.property = { ownerId: ownerId };

      const enquiries = await prisma.enquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          property: {
            select: { id: true, title: true, price: true, location: true },
          },
        },
      });

      return res.json({ enquiries });
    } catch (dbErr) {
      console.warn("DB list failed in listEnquiries, using in-memory store:", dbErr.message);
      let list = fallbackEnquiries;
      if (propertyId) list = list.filter((e) => e.propertyId === propertyId);
      if (status) list = list.filter((e) => e.status === status);
      return res.json({ enquiries: list });
    }
  } catch (error) {
    console.error("Error listing enquiries:", error);
    return res.status(500).json({ error: "Failed to fetch enquiries", details: error.message });
  }
}

export async function updateEnquiryStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, replyMessage } = req.body;

    try {
      const updated = await prisma.enquiry.update({
        where: { id },
        data: {
          ...(status && { status }),
          ...(replyMessage !== undefined && { replyMessage }),
        },
      });
      return res.json({ enquiry: updated });
    } catch (dbErr) {
      const idx = fallbackEnquiries.findIndex((e) => e.id === id);
      if (idx !== -1) {
        if (status) fallbackEnquiries[idx].status = status;
        if (replyMessage !== undefined) fallbackEnquiries[idx].replyMessage = replyMessage;
        return res.json({ enquiry: fallbackEnquiries[idx] });
      }
      return res.status(404).json({ error: "Enquiry not found" });
    }
  } catch (error) {
    console.error("Error updating enquiry:", error);
    return res.status(500).json({ error: "Failed to update enquiry", details: error.message });
  }
}

export async function replyToEnquiry(req, res) {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ error: "Reply message cannot be empty." });
    }

    try {
      const updated = await prisma.enquiry.update({
        where: { id },
        data: {
          replyMessage: replyMessage.trim(),
          status: "REPLIED",
        },
      });
      return res.json({ enquiry: updated, message: "Reply sent successfully." });
    } catch (dbErr) {
      const idx = fallbackEnquiries.findIndex((e) => e.id === id);
      if (idx !== -1) {
        fallbackEnquiries[idx].replyMessage = replyMessage.trim();
        fallbackEnquiries[idx].status = "REPLIED";
        return res.json({ enquiry: fallbackEnquiries[idx], message: "Reply sent successfully." });
      }
      return res.status(404).json({ error: "Enquiry not found." });
    }
  } catch (error) {
    console.error("Error replying to enquiry:", error);
    return res.status(500).json({ error: "Failed to reply to enquiry", details: error.message });
  }
}
