import 'dotenv/config';
import { PrismaClient, Role, Condition } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcrypt';
import * as configFile from '../config/settings.development.json';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);

  await prisma.amenityEntity.createMany({
    data: [
      { name: 'WiFi' },
      { name: 'Outlets' },
      { name: 'AirConditioning' },
      { name: 'Printing' },
      { name: 'Whiteboards' },
      { name: 'ReservableRooms' },
      { name: 'Accessible' },
      { name: 'WaterRefill' },
    ],
    skipDuplicates: true,
  });

  configFile.defaultAccounts.forEach(async (account) => {
    const role = account.role as Role || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {
        password,
      },
      create: {
        email: account.email,
        password,
        role,
      },
    });
    // console.log(`  Created user: ${user.email} with role: ${user.role}`);
  });
  for (const data of configFile.defaultData) {
    const condition = data.condition as Condition || Condition.good;
    console.log(`  Adding stuff: ${JSON.stringify(data)}`);
    await prisma.stuff.upsert({
      where: { id: configFile.defaultData.indexOf(data) + 1 },
      update: {},
      create: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition,
      },
    });
  }
  
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
