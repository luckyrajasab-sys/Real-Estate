import prisma from "../lib/prisma.js";

let fallbackNotifications = [
  {
    id: "notif-1",
    userId: "demo",
    title: "New Site Visit Request",
    message: "Arjun Verma requested a site visit for Sunlit 3BHK near Besant Nagar Beach for Saturday, 11:00 AM.",
    link: "/dashboard",
    read: false,
    type: "ENQUIRY",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "notif-2",
    userId: "demo",
    title: "Buyer Offer Received",
    message: "Karthik Subramanian made an offer of ₹1.75 Cr for Sunlit 3BHK.",
    link: "/dashboard",
    read: false,
    type: "OFFER",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

export async function listNotifications(req, res) {
  try {
    const { userId } = req.query;

    try {
      const where = userId ? { userId } : {};
      const notifications = await prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
      return res.json({ notifications });
    } catch (dbErr) {
      return res.json({ notifications: fallbackNotifications });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch notifications", details: error.message });
  }
}

export async function markNotificationRead(req, res) {
  try {
    const { id } = req.params;

    try {
      const updated = await prisma.notification.update({
        where: { id },
        data: { read: true },
      });
      return res.json({ notification: updated });
    } catch (dbErr) {
      const found = fallbackNotifications.find((n) => n.id === id);
      if (found) found.read = true;
      return res.json({ notification: found });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to mark notification as read", details: error.message });
  }
}
