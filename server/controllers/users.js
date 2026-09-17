import prisma from "../lib/prisma.js";

export async function getUserProfile(req, res) {
  try {
    const { userId, email } = req.query;

    if (!userId && !email) {
      return res.status(400).json({ error: "userId or email is required" });
    }

    const where = userId ? { id: userId } : { email };
    const user = await prisma.user.findUnique({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        verified: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compute stats
    const [listingsCount, savedCount, enquiriesCount, listings] = await Promise.all([
      prisma.property.count({
        where: { ownerId: user.id },
      }),
      prisma.savedListing.count({
        where: { userId: user.id },
      }),
      prisma.enquiry.count({
        where: {
          property: {
            ownerId: user.id,
          },
        },
      }),
      prisma.property.findMany({
        where: { ownerId: user.id },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return res.json({
      user,
      stats: {
        activeListings: listingsCount,
        savedHomes: savedCount,
        enquiriesReceived: enquiriesCount,
      },
      listings,
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    return res.status(500).json({ error: "Failed to fetch user profile", details: error.message });
  }
}

export async function updateUserProfile(req, res) {
  try {
    const { userId, email } = req.query;
    const { name, phone } = req.body;

    if (!userId && !email) {
      return res.status(400).json({ error: "userId or email is required" });
    }

    const where = userId ? { id: userId } : { email };

    const updated = await prisma.user.update({
      where,
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        verified: true,
        role: true,
      },
    });

    return res.json({ user: updated, message: "Profile updated successfully." });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ error: "Failed to update profile", details: error.message });
  }
}

export async function getUserListings(req, res) {
  try {
    const { userId, email } = req.query;

    if (!userId && !email) {
      return res.status(400).json({ error: "userId or email is required" });
    }

    let ownerId = userId;
    if (!ownerId && email) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) ownerId = user.id;
    }

    if (!ownerId) {
      return res.json({ listings: [] });
    }

    const listings = await prisma.property.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ listings });
  } catch (error) {
    console.error("Error getting user listings:", error);
    return res.status(500).json({ error: "Failed to get user listings", details: error.message });
  }
}
