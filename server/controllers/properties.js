import prisma from "../lib/prisma.js";

const DEFAULT_PROPERTIES = [
  {
    id: "p1",
    title: "Skyline Glass Penthouse over Central Park",
    type: "Buy",
    propertyType: "Penthouse",
    price: "$4,950,000",
    priceNum: 4950000,
    currency: "USD",
    country: "United States",
    countryCode: "US",
    city: "New York",
    location: "Manhattan, New York",
    beds: 4,
    baths: 4,
    area: 3800,
    tag: "Ultra Luxury",
    status: "ACTIVE",
    isFeatured: true,
    isFlashOffer: true,
    totalSlots: 5,
    availableSlots: 2,
    discountPercent: 12,
    flashExpiresAt: new Date(Date.now() + 48 * 3600000).toISOString(),
    owner: { name: "Manhattan Prime Real Estate", phone: "+1 212 555 0199" },
    description: "Iconic floor-to-ceiling glass penthouse offering 360-degree Central Park and skyline views, private elevator, and wraparound terrace."
  },
  {
    id: "p2",
    title: "Mayfair Victorian Heritage Townhouse",
    type: "Buy",
    propertyType: "Villa",
    price: "£3,250,000",
    priceNum: 3250000,
    currency: "GBP",
    country: "United Kingdom",
    countryCode: "GB",
    city: "London",
    location: "Mayfair, London",
    beds: 4,
    baths: 3,
    area: 2950,
    tag: "Historic",
    status: "ACTIVE",
    isFeatured: true,
    isFlashOffer: false,
    owner: { name: "Westminster Estates Ltd", phone: "+44 20 7946 0912" },
    description: "Period Victorian residence situated in prestigious Mayfair, boasting ornate cornicing, private mews garden, and wine cellar."
  },
  {
    id: "p3",
    title: "Palm Jumeirah Waterfront Villa with Private Beach",
    type: "Buy",
    propertyType: "Villa",
    price: "AED 12,800,000",
    priceNum: 12800000,
    currency: "AED",
    country: "United Arab Emirates",
    countryCode: "AE",
    city: "Dubai",
    location: "Palm Jumeirah, Dubai",
    beds: 5,
    baths: 6,
    area: 6200,
    tag: "Waterfront",
    status: "ACTIVE",
    isFeatured: true,
    isFlashOffer: true,
    totalSlots: 4,
    availableSlots: 1,
    discountPercent: 15,
    flashExpiresAt: new Date(Date.now() + 36 * 3600000).toISOString(),
    owner: { name: "Emaar Signature Properties", phone: "+971 4 367 3333" },
    description: "Signature Palm beachfront villa with private infinity pool, direct Persian Gulf beach access, and state-of-the-art Italian kitchen."
  },
  {
    id: "p4",
    title: "Roppongi Hills High-Rise 2BHK Residence",
    type: "Buy",
    propertyType: "2BHK",
    price: "¥128,000,000",
    priceNum: 128000000,
    currency: "JPY",
    country: "Japan",
    countryCode: "JP",
    city: "Tokyo",
    location: "Minato-ku, Tokyo",
    beds: 2,
    baths: 2,
    area: 1120,
    tag: "Panoramic View",
    status: "ACTIVE",
    isFeatured: true,
    isFlashOffer: true,
    totalSlots: 6,
    availableSlots: 3,
    discountPercent: 10,
    flashExpiresAt: new Date(Date.now() + 64 * 3600000).toISOString(),
    owner: { name: "Mori Living Tokyo", phone: "+81 3 5555 0142" },
    description: "Ultra-modern Roppongi residence with Mount Fuji skyline vistas, 24-hour bilingual concierge, and membership to the exclusive sky spa."
  },
  {
    id: "p5",
    title: "Le Marais Designer 1BHK Haussmann Apartment",
    type: "Buy",
    propertyType: "1BHK",
    price: "€1,150,000",
    priceNum: 1150000,
    currency: "EUR",
    country: "France",
    countryCode: "FR",
    city: "Paris",
    location: "4th Arrondissement, Paris",
    beds: 1,
    baths: 1,
    area: 720,
    tag: "Haussmannian",
    status: "ACTIVE",
    isFeatured: false,
    isFlashOffer: false,
    owner: { name: "Parisian Elegance Immobilière", phone: "+33 1 42 68 55 00" },
    description: "Classic Haussmann-style apartment with herringbone parquet, marble fireplaces, cast iron balcony, and soaring 3.4-meter ceilings."
  },
  {
    id: "p6",
    title: "Marina Bay Sands View Executive 3BHK",
    type: "Buy",
    propertyType: "3BHK",
    price: "$2,650,000",
    priceNum: 2650000,
    currency: "USD",
    country: "Singapore",
    countryCode: "SG",
    city: "Singapore",
    location: "Marina Bay, Singapore",
    beds: 3,
    baths: 3,
    area: 1850,
    tag: "Iconic View",
    status: "ACTIVE",
    isFeatured: true,
    isFlashOffer: false,
    owner: { name: "CapitaLand Luxury Residences", phone: "+65 6713 2888" },
    description: "Prestigious Marina Bay residence with grand balcony facing Gardens by the Bay, private lift lobby, and smart biometric entry."
  },
  {
    id: "p7",
    title: "Bondi Coastal Haven 2BHK with Ocean Balcony",
    type: "Buy",
    propertyType: "2BHK",
    price: "$1,420,000",
    priceNum: 1420000,
    currency: "USD",
    country: "Australia",
    countryCode: "AU",
    city: "Sydney",
    location: "Bondi Beach, Sydney",
    beds: 2,
    baths: 2,
    area: 1250,
    tag: "Oceanfront",
    status: "ACTIVE",
    isFeatured: false,
    isFlashOffer: false,
    owner: { name: "Sydney Harbour Real Estate", phone: "+61 2 9251 0000" },
    description: "Sun-drenched beachside haven overlooking Bondi surf, European oak finishes, and short stroll to premier coastal cafes."
  },
  {
    id: "p8",
    title: "Sea-Facing Luxury 4BHK Penthouse",
    type: "Buy",
    propertyType: "4BHK+",
    price: "₹14.5 Cr",
    priceNum: 145000000,
    currency: "INR",
    country: "India",
    countryCode: "IN",
    city: "Mumbai",
    location: "Bandra West, Mumbai",
    beds: 4,
    baths: 5,
    area: 4100,
    tag: "Celebrity Enclave",
    status: "ACTIVE",
    isFeatured: true,
    isFlashOffer: true,
    totalSlots: 3,
    availableSlots: 1,
    discountPercent: 8,
    flashExpiresAt: new Date(Date.now() + 28 * 3600000).toISOString(),
    owner: { name: "Lodha Premier Group", phone: "+91 22 6773 7373" },
    description: "Lavish duplex penthouse in Bandra offering sweeping Arabian Sea views, private plunge pool, and dedicated 4-car parking bay."
  },
  {
    id: "p9",
    title: "Sunlit 3BHK near Besant Nagar Beach",
    type: "Buy",
    propertyType: "3BHK",
    price: "₹1.85 Cr",
    priceNum: 18500000,
    currency: "INR",
    country: "India",
    countryCode: "IN",
    city: "Chennai",
    location: "Besant Nagar, Chennai",
    beds: 3,
    baths: 3,
    area: 1650,
    tag: "Ready to move",
    status: "ACTIVE",
    isFeatured: false,
    isFlashOffer: false,
    owner: { name: "Demo Owner", phone: "+91 98400 12345" },
    description: "East-facing 3-bedroom apartment with sea breeze, modular kitchen, covered car park, and round-the-clock security just 400m from Elliot's beach."
  },
  {
    id: "p10",
    title: "Lake Geneva Panoramic Villa & Vineyard",
    type: "Buy",
    propertyType: "Villa",
    price: "€7,800,000",
    priceNum: 7800000,
    currency: "EUR",
    country: "Switzerland",
    countryCode: "CH",
    city: "Geneva",
    location: "Cologny, Geneva",
    beds: 6,
    baths: 6,
    area: 7100,
    tag: "Alpine Luxury",
    status: "ACTIVE",
    isFeatured: true,
    isFlashOffer: false,
    owner: { name: "Swiss Private Properties SA", phone: "+41 22 319 8888" },
    description: "Spectacular Cologny estate overlooking Lake Geneva and Mont Blanc, complete with private vineyard, spa pavilion, and guest chalet."
  },
  {
    id: "p11",
    title: "Tribeca Minimalist Studio Loft",
    type: "Rent",
    propertyType: "Studio",
    price: "$3,800/mo",
    priceNum: 3800,
    currency: "USD",
    country: "United States",
    countryCode: "US",
    city: "New York",
    location: "Tribeca, New York",
    beds: 1,
    baths: 1,
    area: 650,
    tag: "High Ceilings",
    status: "ACTIVE",
    isFeatured: false,
    isFlashOffer: false,
    owner: { name: "Tribeca Loft Management", phone: "+1 212 555 4321" },
    description: "Cast-iron historic building loft with exposed brick, 12ft timber-beamed ceilings, chef's galley kitchen, and key-locked elevator."
  },
  {
    id: "p12",
    title: "Kensington Garden 2BHK Serviced Residence",
    type: "Rent",
    propertyType: "2BHK",
    price: "£3,400/mo",
    priceNum: 3400,
    currency: "GBP",
    country: "United Kingdom",
    countryCode: "GB",
    city: "London",
    location: "Kensington, London",
    beds: 2,
    baths: 2,
    area: 1100,
    tag: "Furnished",
    status: "ACTIVE",
    isFeatured: true,
    isFlashOffer: true,
    totalSlots: 8,
    availableSlots: 2,
    discountPercent: 20,
    flashExpiresAt: new Date(Date.now() + 52 * 3600000).toISOString(),
    owner: { name: "Chesterfield Lettings", phone: "+44 20 7589 1234" },
    description: "Superbly renovated 2BHK flat overlooking private communal gardens, featuring designer Italian furnishings and weekly housekeeping."
  },
  {
    id: "p13",
    title: "Downtown Dubai Burj View 1BHK Suite",
    type: "Rent",
    propertyType: "1BHK",
    price: "AED 9,500/mo",
    priceNum: 9500,
    currency: "AED",
    country: "United Arab Emirates",
    countryCode: "AE",
    city: "Dubai",
    location: "Downtown, Dubai",
    beds: 1,
    baths: 1,
    area: 780,
    tag: "All Amenities",
    status: "ACTIVE",
    isFeatured: false,
    isFlashOffer: false,
    owner: { name: "Downtown Elite Rentals", phone: "+971 4 456 7890" },
    description: "Floor 42 suite with unobstructed front-row views of Burj Khalifa and Dubai Fountain, inclusive of rooftop pool and gym pass."
  },
  {
    id: "p14",
    title: "Shinjuku Modern Compact 1BHK",
    type: "Rent",
    propertyType: "1BHK",
    price: "¥210,000/mo",
    priceNum: 210000,
    currency: "JPY",
    country: "Japan",
    countryCode: "JP",
    city: "Tokyo",
    location: "Shinjuku, Tokyo",
    beds: 1,
    baths: 1,
    area: 480,
    tag: "Near Metro",
    status: "ACTIVE",
    isFeatured: false,
    isFlashOffer: false,
    owner: { name: "Tokyo City Housing", phone: "+81 3 3344 1122" },
    description: "Quiet designer corner apartment 4 mins walk from Shinjuku-sanchome Station. Built-in work desk, high-speed fiber internet, and auto-bath system."
  },
  {
    id: "p15",
    title: "Indiranagar Green Terrace 3BHK Villa",
    type: "Rent",
    propertyType: "3BHK",
    price: "₹65,000/mo",
    priceNum: 65000,
    currency: "INR",
    country: "India",
    countryCode: "IN",
    city: "Bangalore",
    location: "Indiranagar, Bangalore",
    beds: 3,
    baths: 3,
    area: 2100,
    tag: "Tech Corridor",
    status: "ACTIVE",
    isFeatured: false,
    isFlashOffer: false,
    owner: { name: "Bengaluru Realty", phone: "+91 80 2525 9988" },
    description: "Tranquil tree-lined villa with private terrace garden, solar power backup, servant quarters, and fast access to 100ft Road dining."
  },
  {
    id: "p16",
    title: "Manhattan Corporate Executive Penthouse",
    type: "Lease",
    propertyType: "Penthouse",
    price: "$14,000/mo",
    priceNum: 14000,
    currency: "USD",
    country: "United States",
    countryCode: "US",
    city: "New York",
    location: "Midtown Manhattan, New York",
    beds: 3,
    baths: 3,
    area: 2600,
    leaseTerm: "2 to 5 Years",
    tag: "Corporate Lease",
    status: "ACTIVE",
    isFeatured: true,
    isFlashOffer: true,
    totalSlots: 5,
    availableSlots: 2,
    discountPercent: 15,
    flashExpiresAt: new Date(Date.now() + 40 * 3600000).toISOString(),
    owner: { name: "NYC Corporate Housing Group", phone: "+1 212 987 6543" },
    description: "Turnkey executive penthouse designed for multinational corporate leases. Includes private meeting room, dedicated fiber link, and chauffeur parking."
  },
  {
    id: "p17",
    title: "Canary Wharf Diplomatic 3BHK Waterfront Suite",
    type: "Lease",
    propertyType: "3BHK",
    price: "£5,500/mo",
    priceNum: 5500,
    currency: "GBP",
    country: "United Kingdom",
    countryCode: "GB",
    city: "London",
    location: "Canary Wharf, London",
    beds: 3,
    baths: 3,
    area: 1900,
    leaseTerm: "1 to 3 Years",
    tag: "Long Term Lease",
    status: "ACTIVE",
    isFeatured: false,
    isFlashOffer: false,
    owner: { name: "Thames Waterfront Leases", phone: "+44 20 7987 0011" },
    description: "Modern riverside duplex with panoramic River Thames vistas, 24h concierge, private health club, and secure underground double garage."
  },
  {
    id: "p18",
    title: "Dubai Hills Golf Club Luxury Estate Villa",
    type: "Lease",
    propertyType: "Villa",
    price: "AED 38,000/mo",
    priceNum: 38000,
    currency: "AED",
    country: "United Arab Emirates",
    countryCode: "AE",
    city: "Dubai",
    location: "Dubai Hills, Dubai",
    beds: 5,
    baths: 5,
    area: 5400,
    leaseTerm: "2 to 5 Years",
    tag: "Golf Course View",
    status: "ACTIVE",
    isFeatured: true,
    isFlashOffer: false,
    owner: { name: "Emaar Luxury Leases", phone: "+971 4 367 7777" },
    description: "Exclusive golf fairway villa with infinity pool, smart climate control, staff quarters, and 18-hole championship golf club privileges."
  },
  {
    id: "p19",
    title: "Bandra Kurla Complex (BKC) Executive 2BHK",
    type: "Lease",
    propertyType: "2BHK",
    price: "₹1,40,000/mo",
    priceNum: 140000,
    currency: "INR",
    country: "India",
    countryCode: "IN",
    city: "Mumbai",
    location: "BKC, Mumbai",
    beds: 2,
    baths: 2,
    area: 1350,
    leaseTerm: "3 Years Fixed",
    tag: "Commercial Hub",
    status: "ACTIVE",
    isFeatured: false,
    isFlashOffer: false,
    owner: { name: "BKC Commercial & Residential", phone: "+91 22 2650 1122" },
    description: "Spacious corner unit located right in the heart of Mumbai's premier financial hub. Complete business center and swimming pool amenities."
  },
  {
    id: "p20",
    title: "Omotesando Architectural Minimalist Studio",
    type: "Lease",
    propertyType: "Studio",
    price: "¥320,000/mo",
    priceNum: 320000,
    currency: "JPY",
    country: "Japan",
    countryCode: "JP",
    city: "Tokyo",
    location: "Shibuya, Tokyo",
    beds: 1,
    baths: 1,
    area: 620,
    leaseTerm: "1 Year Renewable",
    tag: "Architectural Gem",
    status: "ACTIVE",
    isFeatured: false,
    isFlashOffer: false,
    owner: { name: "Tokyo Design Living", phone: "+81 3 5410 8899" },
    description: "Custom architect-designed studio featuring fair-faced concrete, concealed storage walls, and premier boutique shopping at your doorstep."
  }
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
      city,
      country,
      countryCode,
      currency,
      isFlashOffer,
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

    if (city && city !== "All") {
      where.city = { equals: city, mode: "insensitive" };
    }

    if (country && country !== "All") {
      where.country = { equals: country, mode: "insensitive" };
    }

    if (countryCode && countryCode !== "All") {
      where.countryCode = { equals: countryCode.toUpperCase() };
    }

    if (currency && currency !== "All") {
      where.currency = { equals: currency.toUpperCase() };
    }

    if (isFlashOffer === "true" || isFlashOffer === true) {
      where.isFlashOffer = true;
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
        { country: { contains: search, mode: "insensitive" } },
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
    let filtered = [...DEFAULT_PROPERTIES];

    if (req.query.type) {
      filtered = filtered.filter((p) => p.type?.toLowerCase() === req.query.type.toLowerCase());
    }
    if (req.query.propertyType && req.query.propertyType !== "All") {
      filtered = filtered.filter((p) => p.propertyType?.toLowerCase() === req.query.propertyType.toLowerCase());
    }
    if (req.query.city && req.query.city !== "All") {
      filtered = filtered.filter((p) => p.city?.toLowerCase() === req.query.city.toLowerCase());
    }
    if (req.query.country && req.query.country !== "All") {
      filtered = filtered.filter((p) => p.country?.toLowerCase() === req.query.country.toLowerCase());
    }
    if (req.query.countryCode && req.query.countryCode !== "All") {
      filtered = filtered.filter((p) => p.countryCode?.toUpperCase() === req.query.countryCode.toUpperCase());
    }
    if (req.query.currency && req.query.currency !== "All") {
      filtered = filtered.filter((p) => p.currency?.toUpperCase() === req.query.currency.toUpperCase());
    }
    if (req.query.isFlashOffer === "true" || req.query.isFlashOffer === true) {
      filtered = filtered.filter((p) => p.isFlashOffer === true);
    }
    if (req.query.beds) {
      filtered = filtered.filter((p) => p.beds >= parseInt(req.query.beds, 10));
    }
    if (req.query.q) {
      const q = req.query.q.toLowerCase();
      filtered = filtered.filter((p) =>
        (p.title + " " + p.location + " " + (p.city || "") + " " + (p.country || "")).toLowerCase().includes(q)
      );
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

export async function reserveSlot(req, res) {
  try {
    const { id } = req.params;
    const { userName, userEmail, userPhone } = req.body;

    try {
      const property = await prisma.property.findUnique({
        where: { id },
      });

      if (!property) {
        return res.status(404).json({ error: "Offer listing not found." });
      }

      if (!property.isFlashOffer) {
        return res.status(400).json({ error: "This listing does not have live slot offers active." });
      }

      if (property.availableSlots <= 0) {
        return res.status(400).json({ error: "Sorry, all live offer slots have already been claimed!" });
      }

      const updated = await prisma.property.update({
        where: { id },
        data: {
          availableSlots: { decrement: 1 },
        },
      });

      return res.json({
        success: true,
        message: `Congratulations ${userName || "Valued Buyer"}! Your priority slot has been locked successfully.`,
        remainingSlots: updated.availableSlots,
        property: updated,
      });
    } catch (dbErr) {
      // In-memory fallback
      console.warn("DB reservation fallback for property:", id, dbErr.message);
      const prop = DEFAULT_PROPERTIES.find((p) => p.id === id);
      if (!prop) {
        return res.status(404).json({ error: "Offer listing not found." });
      }

      if (prop.availableSlots <= 0) {
        return res.status(400).json({ error: "All live offer slots have already been claimed!" });
      }

      prop.availableSlots = Math.max(0, (prop.availableSlots || 1) - 1);

      return res.json({
        success: true,
        message: `Congratulations ${userName || "Valued Buyer"}! Your priority slot has been locked successfully.`,
        remainingSlots: prop.availableSlots,
        property: prop,
      });
    }
  } catch (error) {
    console.error("Error reserving slot:", error);
    return res.status(500).json({ error: "Failed to reserve slot", details: error.message });
  }
}

