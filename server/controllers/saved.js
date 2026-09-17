import prisma from "../lib/prisma.js";

export async function listSaved(req, res) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required to list saved properties" });
    }

    const saved = await prisma.savedListing.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        property: true,
      },
    });

    return res.json({ savedListings: saved.map((s) => s.property) });
  } catch (error) {
    console.error("Error listing saved properties:", error);
    return res.status(500).json({ error: "Failed to fetch saved properties", details: error.message });
  }
}

export async function toggleSaved(req, res) {
  try {
    const { propertyId } = req.params;
    const { userId } = req.body;

    if (!propertyId || !userId) {
      return res.status(400).json({ error: "propertyId and userId are required" });
    }

    const existing = await prisma.savedListing.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });

    if (existing) {
      await prisma.savedListing.delete({
        where: { id: existing.id },
      });
      return res.json({ saved: false, message: "Property removed from saved." });
    } else {
      await prisma.savedListing.create({
        data: {
          userId,
          propertyId,
        },
      });
      return res.json({ saved: true, message: "Property saved." });
    }
  } catch (error) {
    console.error("Error toggling saved property:", error);
    return res.status(500).json({ error: "Failed to toggle save status", details: error.message });
  }
}

export async function checkSaved(req, res) {
  try {
    const { propertyId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.json({ saved: false });
    }

    const existing = await prisma.savedListing.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });

    return res.json({ saved: Boolean(existing) });
  } catch (error) {
    return res.json({ saved: false });
  }
}
