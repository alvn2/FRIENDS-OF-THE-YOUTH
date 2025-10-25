import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // --- 1. Create Admin User ---
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('adminpassword', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@foty.org' },
    update: {},
    create: {
      email: 'admin@foty.org',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '0000000000',
      bio: 'Default administrator account for Friends of the Youth.',
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // --- 2. Create Default Badges ---
  const badgesData = [
    {
      name: 'New Member',
      description: 'Awarded for successfully registering.',
      iconUrl: 'https://placehold.co/100x100/FFF/333?text=✨', // Using placeholder icon
    },
    {
      name: 'First Donation',
      description: 'Awarded for making your first donation.',
      iconUrl: 'https://placehold.co/100x100/FFF/333?text=❤️',
    },
    {
      name: 'Big Spender',
      description: 'Awarded for donating a total of 5,000 KES or more.',
      iconUrl: 'https://placehold.co/100x100/FFF/333?text=💎',
    },
    {
      name: 'Event Goer',
      description: 'Awarded for attending your first event.',
      iconUrl: 'https://placehold.co/100x100/FFF/333?text=📅',
    },
    {
      name: 'Community Pillar',
      description: 'Awarded for being a member for over one year.',
      iconUrl: 'https://placehold.co/100x100/FFF/333?text=🛡️',
    },
  ];

  await prisma.badge.createMany({
    data: badgesData,
    skipDuplicates: true, // Skip if a badge with the same name already exists
  });
  console.log('Default badges created/updated.');

  // --- 3. Create a Sample Event ---
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.event.upsert({
    where: { name: 'Community Meet & Greet' },
    update: {},
    create: {
      name: 'Community Meet & Greet',
      description:
        'Join us for our first community meet and greet! A great chance to network, share ideas, and plan for the future. Snacks and refreshments will be provided.',
      date: tomorrow,
      location: 'FOTY Main Hall, Nairobi',
      capacity: 50,
      imageUrl: 'https://placehold.co/600x400/5A9/FFF?text=FOTY+Event',
    },
  });
  console.log('Created sample event: Community Meet & Greet');

  // --- 4. Create a Sample Bulletin Post ---
  await prisma.bulletinPost.upsert({
    where: { title: 'Welcome to the FOTY Bulletin!' },
    update: {},
    create: {
      title: 'Welcome to the FOTY Bulletin!',
      content:
        'This is the official community bulletin board. Share your ideas, ask questions, and connect with other members. We are excited to have you here!',
      authorId: admin.id, // Post as the Admin
    },
  });
  console.log('Created sample bulletin post.');

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error('An error occurred while seeding the database:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the Prisma Client connection
    await prisma.$disconnect();
  });

