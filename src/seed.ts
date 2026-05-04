import { prisma } from './lib/prisma';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

type SeedRole = 'USER' | 'ADMIN';
type SeedCondition = 'excellent' | 'good' | 'fair' | 'poor';

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);
  config.defaultAccounts.forEach(async (account) => {
    const role: SeedRole = (account.role as SeedRole) || 'USER';
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        //fullName: inferFullNameFromEmail(account.email),
        email: account.email,
        password,
        role,
      },
    });
    // console.log(`  Created user: ${user.email} with role: ${user.role}`);

  });
  for (const data of config.defaultData) {
    const condition: SeedCondition = (data.condition as SeedCondition) || 'good';
    console.log(`  Adding stuff: ${JSON.stringify(data)}`);
     
    await prisma.stuff.upsert({
      where: { id: config.defaultData.indexOf(data) + 1 },
      update: {},
      create: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition,
      },
    });
  }

  console.log('Seeding amenities...');
    await prisma.amenityEntity.createMany({
      data: [
        { name: 'Outlets' },
        { name: 'AirConditioning' },
        { name: 'WiFi' },
        { name: 'Printing' },
        { name: 'Whiteboards' },
        { name: 'ReservableRooms' },
        { name: 'Accessible' },
        { name: 'WaterRefill' },
      ],
      skipDuplicates: true,
    });

    console.log('✅ Amenities seeded successfully');
  }
  
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
