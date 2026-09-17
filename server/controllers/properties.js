import prisma from "../lib/prisma.js";

const DEFAULT_PROPERTIES = [
  {
    id: "p1",
    title: "Sunlit 3BHK near Besant Nagar Beach",
    type: "Buy",
    propertyType: "Apartment",
    price: "₹1.85 Cr",
    priceNum: 18500000,
    location: "Besant Nagar, Chennai",
    city: "Chennai",
    beds: 3,
    baths: 3,
    area: 1650,
    tag: "Ready to move",
    status: "ACTIVE",
    isFeatured: true,
    owner: { name: "Demo Owner", phone: "+91 98400 12345" },
  },
  {
    id: "p2",
    title: "Compact 2BHK with terrace garden",
    type: "Buy",
    propertyType: "Apartment",
    price: "₹78 L",
    priceNum: 7800000,
    location: "Velachery, Chennai",
    city: "Chennai",
    beds: 2,
    baths: 2,
    area: 980,
    tag: "New listing",
    status: "ACTIVE",
    isFeatured: true,
    owner: { name: "Demo Owner", phone: "+91 98400 12345" },
  },
  {
    id: "p3",
    title: "Independent villa with private pool",
    type: "Buy",
    propertyType: "Villa",
    price: "₹4.2 Cr",
    priceNum: 42000000,
    location: "ECR, Chennai",
    city: "Chennai",
    beds: 4,
    baths: 4,
    area: 3400,
    tag: "Premium",
    status: "ACTIVE",
    isFeatured: true,
    owner: { name: "Demo Owner", phone: "+91 98400 12345" },
  },
  {
    id: "p4",
    title: "Furnished 1BHK studio",
    type: "Rent",
    propertyType: "Apartment",
    price: "₹18,000/mo",
    priceNum: 18000,
    location: "Adyar, Chennai",
    city: "Chennai",
    beds: 1,
    baths: 1,
    area: 520,
    tag: "Furnished",
    status: "ACTIVE",
    isFeatured: false,
    owner: { name: "Demo Owner", phone: "+91 98400 12345" },
  },
  {
    id: "p5",
    title: "Spacious 2BHK near tech park",
    type: "Rent",
    propertyType: "Apartment",
    price: "₹27,500/mo",
    priceNum: 27500,
    location: "OMR, Chennai",
    city: "Chennai",
    beds: 2,
    baths: 2,
    area: 1100,
    tag: "Pet friendly",
    status: "ACTIVE",
    isFeatured: false,
    owner: { name: "Demo Owner", phone: "+91 98400 12345" },
  },
  {
    id: "p6",
    title: "Family 3BHK with covered parking",
    type: "Rent",
    propertyType: "Apartment",
    price: "₹34,000/mo",
    priceNum: 34000,
    location: "Anna Nagar, Chennai",
    city: "Chennai",
    beds: 3,
    baths: 2,
    area: 1450,
    tag: "Available now",
    status: "ACTIVE",
    isFeatured: false,
    owner: { name: "Demo Owner", phone: "+91 98400 12345" },
  },
];

// Helper to convert formatted price string (e.g. "₹1.85 Cr", "₹78 L", "₹25,000/mo") to a float
export function parsePriceNum(priceStr) {
  if (!priceStr) return 0;
  if (typeof priceStr === "number") return priceStr;
  const clean = priceStr.replace(/,/g, "").trim();

  const crMatch = clean.match(/([\d.]+)\s*Cr/i);
  if (crMatch) return parseFloat(crMatch[1]) * 10000000;

  const lMatch = clean.match(/([\d.]+)\s*L/i);
  if (lMatch) return parseFloat(lMatch[1]) * 100000;

  const numMatch = clean.match(/[\d.]+/);
  if (numMatch) return parseFloat(numMatch[0]);

  return 0;
}

export async function listProperties(req, res) {
  try {
    const {
      type,
      propertyType,
      q,
      minPrice,
      maxPrice,
      beds,
      baths,
      tag,
      status = "ACTIVE",
      sortBy = "newest",
      page = 1,
      limit = 24,
    } = req.query;

    const where = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (type) {
      where.type = { equals: type, mode: "insensitive" };
    }

    if (propertyType && propertyType !== "All") {
      where.propertyType = { equals: propertyType, mode: "insensitive" };
    }

    if (beds) {
      where.beds = { gte: parseInt(beds, 10) };
    }

    if (baths) {
      where.baths = { gte: parseInt(baths, 10) };
    }

    if (tag && tag !== "All") {
      where.tag = { equals: tag, mode: "insensitive" };
    }

    if (minPrice || maxPrice) {
      where.priceNum = {};
      if (minPrice) where.priceNum.gte = parseFloat(minPrice);
      if (maxPrice) where.priceNum.lte = parseFloat(maxPrice);
    }

    if (q && q.trim()) {
      const search = q.trim();
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    let orderBy = { createdAt: "desc" };
    if (sortBy === "price_asc") orderBy = { priceNum: "asc" };
    if (sortBy === "price_desc") orderBy = { priceNum: "desc" };

    const take = parseInt(limit, 10) || 24;
    const skip = ((parseInt(page, 10) || 1) - 1) * take;

    const [total, properties] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          owner: {
            select: { id: true, name: true, email: true, phone: true },
          },
          _count: {
            select: { savedListings: true, enquiries: true },
          },
        },
      }),
    ]);

    return res.json({
      properties,
      pagination: {
        total,
        page: parseInt(page, 10) || 1,
        limit: take,
        totalPages: Math.ceil(total / take) || 1,
      },
    });
  } catch (error) {
    console.warn("Database query failed in listProperties, serving fallback dataset:", error.message);
    let filtered = DEFAULT_PROPERTIES;
    if (req.query.type) {
      filtered = filtered.filter((p) => p.type.toLowerCase() === req.query.type.toLowerCase());
    }
    if (req.query.q) {
      const q = req.query.q.toLowerCase();
      filtered = filtered.filter((p) => (p.title + p.location).toLowerCase().includes(q));
    }
    if (req.query.tag && req.query.tag !== "All") {
      filtered = filtered.filter((p) => p.tag === req.query.tag);
    }
    return res.json({
      properties: filtered,
      pagination: { total: filtered.length, page: 1, limit: filtered.length, totalPages: 1 },
      isFallback: true,
    });
  }
}

export async function getFeaturedProperties(req, res) {
  try {
    const featured = await prisma.property.findMany({
      where: {
        status: "ACTIVE",
        isFeatured: true,
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    if (!featured.length) {
      const fallback = await prisma.property.findMany({
        where: { status: "ACTIVE" },
        take: 3,
        orderBy: { createdAt: "desc" },
      });
      return res.json({ properties: fallback });
    }

    return res.json({ properties: featured });
  } catch (error) {
    console.warn("Database query failed in getFeaturedProperties, serving fallback dataset:", error.message);
    return res.json({ properties: DEFAULT_PROPERTIES.slice(0, 3), isFallback: true });
  }
}

export async function getPropertyById(req, res) {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true, phone: true },
        },
        _count: {
          select: { savedListings: true, enquiries: true },
        },
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Listing not found" });
    }

    return res.json({ property });
  } catch (error) {
    console.warn("Database query failed in getPropertyById, checking fallback dataset:", error.message);
    const prop = DEFAULT_PROPERTIES.find((p) => p.id === req.params.id);
    if (prop) return res.json({ property: prop, isFallback: true });
    return res.status(404).json({ error: "Listing not found" });
  }
}

export async function createProperty(req, res) {
  try {
    const {
      title,
      type = "Buy",
      propertyType = "Apartment",
      price,
      priceNum,
      location,
      city = "Chennai",
      beds = 1,
      baths = 1,
      area = 500,
      tag = "Ready to move",
      description = "",
      status = "ACTIVE",
      ownerId,
      images,
    } = req.body;

    if (!title || !price || !location) {
      return res.status(400).json({ error: "Title, price, and location are required." });
    }

    const calculatedPriceNum = priceNum !== undefined ? parseFloat(priceNum) : parsePriceNum(price);

    const property = await prisma.property.create({
      data: {
        title,
        type,
        propertyType,
        price,
        priceNum: calculatedPriceNum,
        location,
        city,
        beds: parseInt(beds, 10) || 1,
        baths: parseInt(baths, 10) || 1,
        area: parseInt(area, 10) || 500,
        tag,
        description,
        status,
        ownerId: ownerId || null,
        images: images ? (typeof images === "string" ? images : JSON.stringify(images)) : null,
      },
    });

    return res.status(201).json({ property });
  } catch (error) {
    console.error("Error creating property:", error);
    return res.status(500).json({ error: "Failed to create property", details: error.message });
  }
}

export async function updateProperty(req, res) {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (data.price && data.priceNum === undefined) {
      data.priceNum = parsePriceNum(data.price);
    }
    if (data.beds) data.beds = parseInt(data.beds, 10);
    if (data.baths) data.baths = parseInt(data.baths, 10);
    if (data.area) data.area = parseInt(data.area, 10);
    if (data.images && typeof data.images !== "string") {
      data.images = JSON.stringify(data.images);
    }

    const updated = await prisma.property.update({
      where: { id },
      data,
    });

    return res.json({ property: updated });
  } catch (error) {
    console.error("Error updating property:", error);
    return res.status(500).json({ error: "Failed to update property", details: error.message });
  }
}

export async function deleteProperty(req, res) {
  try {
    const { id } = req.params;

    await prisma.property.delete({
      where: { id },
    });

    return res.json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    return res.status(500).json({ error: "Failed to delete property", details: error.message });
  }
}
