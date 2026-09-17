import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initialProperties = [
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
    description: "East-facing 3-bedroom apartment with sea breeze, modular kitchen, covered car park, and round-the-clock security just 400m from Elliot's beach."
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
    description: "Well-ventilated 2BHK with exclusive terrace garden access, close to MRTS and Phoenix Marketcity. Low maintenance and high rental demand."
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
    description: "Luxury 4BHK beachside villa featuring landscaped garden, private dipping pool, Italian marble flooring, and smart home automation."
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
    description: "Fully furnished modern studio apartment with AC, Wi-Fi ready, kitchen appliances, and 100% power backup. Ideal for working professionals."
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
    description: "Gated community living with gym, swimming pool, and clubhouse. Located 5 minutes from major IT corridors on Old Mahabalipuram Road."
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
    description: "Prime residential location near Tower Park and leading schools. Includes 2 covered car parks, piped gas connection, and lift access."
  },
];

async function main() {
  console.log("Seeding database...");

  // Upsert demo user
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@offhome.in" },
    update: {},
    create: {
      email: "demo@offhome.in",
      name: "Demo Owner",
      phone: "+91 98400 12345",
      verified: true,
      role: "USER"
    }
  });

  console.log(`Demo user ready: ${demoUser.email} (${demoUser.id})`);

  for (const prop of initialProperties) {
    await prisma.property.upsert({
      where: { id: prop.id },
      update: {
        ...prop,
        ownerId: demoUser.id
      },
      create: {
        ...prop,
        ownerId: demoUser.id
      }
    });
  }

  console.log(`Successfully seeded ${initialProperties.length} properties!`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
