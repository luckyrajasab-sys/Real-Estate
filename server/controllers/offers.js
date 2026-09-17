import prisma from "../lib/prisma.js";

let fallbackOffers = [
  {
    id: "off-1",
    propertyId: "p1",
    buyerId: "buyer-1",
    buyerName: "Karthik Subramanian",
    buyerEmail: "karthik.subbu@example.com",
    buyerPhone: "+91 94440 98765",
    amount: 17500000,
    amountDisplay: "₹1.75 Cr",
    message: "Ready with 20% down payment and pre-approved home loan. Can close within 30 days.",
    status: "PENDING",
    counterAmount: null,
    counterNote: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    property: {
      id: "p1",
      title: "Sunlit 3BHK near Besant Nagar Beach",
      price: "₹1.85 Cr",
      location: "Besant Nagar, Chennai",
    },
  },
  {
    id: "off-2",
    propertyId: "p2",
    buyerId: "buyer-2",
    buyerName: "Ananya Ramesh",
    buyerEmail: "ananya.r@example.com",
    buyerPhone: "+91 98840 55443",
    amount: 7200000,
    amountDisplay: "₹72 L",
    message: "Immediate buyer, flexible on possession date.",
    status: "COUNTERED",
    counterAmount: 7500000,
    counterNote: "Owner replied: Lowest acceptable is ₹75 L including covered car parking.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    property: {
      id: "p2",
      title: "Compact 2BHK with terrace garden",
      price: "₹78 L",
      location: "Velachery, Chennai",
    },
  },
];

export async function createOffer(req, res) {
  try {
    const {
      propertyId,
      buyerId,
      buyerName,
      buyerEmail,
      buyerPhone,
      amount,
      amountDisplay,
      message,
    } = req.body;

    if (!propertyId || !buyerName || !buyerPhone || !amount) {
      return res.status(400).json({ error: "Property, buyer name, phone, and offer amount are required." });
    }

    try {
      const offer = await prisma.offer.create({
        data: {
          propertyId,
          buyerId: buyerId || null,
          buyerName,
          buyerEmail: buyerEmail || null,
          buyerPhone,
          amount: parseFloat(amount),
          amountDisplay: amountDisplay || `₹${amount}`,
          message: message || null,
          status: "PENDING",
        },
        include: {
          property: {
            select: { id: true, title: true, price: true, location: true },
          },
        },
      });

      return res.status(201).json({ offer, message: "Offer submitted successfully." });
    } catch (dbErr) {
      console.warn("DB write failed in createOffer, using in-memory store:", dbErr.message);
      const newOffer = {
        id: `off-${Date.now()}`,
        propertyId,
        buyerId: buyerId || null,
        buyerName,
        buyerEmail: buyerEmail || null,
        buyerPhone,
        amount: parseFloat(amount),
        amountDisplay: amountDisplay || `₹${amount}`,
        message: message || null,
        status: "PENDING",
        counterAmount: null,
        counterNote: null,
        createdAt: new Date().toISOString(),
        property: {
          id: propertyId,
          title: "Property Listing",
          price: "Price on request",
          location: "Chennai",
        },
      };
      fallbackOffers.unshift(newOffer);
      return res.status(201).json({ offer: newOffer, message: "Offer submitted successfully." });
    }
  } catch (error) {
    console.error("Error creating offer:", error);
    return res.status(500).json({ error: "Failed to submit offer", details: error.message });
  }
}

export async function listOffers(req, res) {
  try {
    const { propertyId, buyerId, ownerId, status } = req.query;

    try {
      const where = {};
      if (propertyId) where.propertyId = propertyId;
      if (buyerId) where.buyerId = buyerId;
      if (status) where.status = status;
      if (ownerId) where.property = { ownerId: ownerId };

      const offers = await prisma.offer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          property: {
            select: { id: true, title: true, price: true, location: true, status: true },
          },
        },
      });

      return res.json({ offers });
    } catch (dbErr) {
      console.warn("DB list failed in listOffers, using in-memory store:", dbErr.message);
      let list = fallbackOffers;
      if (propertyId) list = list.filter((o) => o.propertyId === propertyId);
      if (status) list = list.filter((o) => o.status === status);
      return res.json({ offers: list });
    }
  } catch (error) {
    console.error("Error listing offers:", error);
    return res.status(500).json({ error: "Failed to fetch offers", details: error.message });
  }
}

export async function respondToOffer(req, res) {
  try {
    const { id } = req.params;
    const { action, counterAmount, counterNote } = req.body; // action: "ACCEPT" | "COUNTER" | "REJECT"

    if (!["ACCEPT", "COUNTER", "REJECT"].includes(action)) {
      return res.status(400).json({ error: "Invalid action. Must be ACCEPT, COUNTER, or REJECT." });
    }

    let status = "PENDING";
    if (action === "ACCEPT") status = "ACCEPTED";
    if (action === "COUNTER") status = "COUNTERED";
    if (action === "REJECT") status = "REJECTED";

    try {
      const updated = await prisma.offer.update({
        where: { id },
        data: {
          status,
          ...(action === "COUNTER" && {
            counterAmount: counterAmount ? parseFloat(counterAmount) : null,
            counterNote: counterNote || null,
          }),
        },
        include: { property: true },
      });

      // If accepted, also mark property as UNDER_OFFER
      if (action === "ACCEPT" && updated.propertyId) {
        await prisma.property.update({
          where: { id: updated.propertyId },
          data: { status: "UNDER_OFFER" },
        });
      }

      return res.json({ offer: updated, message: `Offer ${status.toLowerCase()} successfully.` });
    } catch (dbErr) {
      const idx = fallbackOffers.findIndex((o) => o.id === id);
      if (idx !== -1) {
        fallbackOffers[idx].status = status;
        if (action === "COUNTER") {
          fallbackOffers[idx].counterAmount = counterAmount ? parseFloat(counterAmount) : null;
          fallbackOffers[idx].counterNote = counterNote || null;
        }
        return res.json({ offer: fallbackOffers[idx], message: `Offer ${status.toLowerCase()} successfully.` });
      }
      return res.status(404).json({ error: "Offer not found." });
    }
  } catch (error) {
    console.error("Error responding to offer:", error);
    return res.status(500).json({ error: "Failed to respond to offer", details: error.message });
  }
}
