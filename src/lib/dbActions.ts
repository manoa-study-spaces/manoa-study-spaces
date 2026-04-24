'use server';

import { Amenity, FoodAllowed, NoiseLevel, Occupancy, SpaceType } from '@prisma/client';
import { hash } from 'bcrypt';
import { Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';

type StuffCondition = 'excellent' | 'good' | 'fair' | 'poor';

type StuffItem = {
  id: number;
  name: string;
  quantity: number;
  owner: string;
  condition: StuffCondition;
};

type CreateUserResult =
  | { ok: true }
  | { ok: false; code: 'EMAIL_EXISTS' }
  | { ok: false; code: 'UNKNOWN_ERROR'; detail: string };

function getErrorDetail(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const meta = error.meta ? JSON.stringify(error.meta) : 'none';
    return `PrismaKnown(${error.code}) meta=${meta}`;
  }
  if (error instanceof Prisma.PrismaClientValidationError) {
    return 'PrismaValidationError';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error type';
}

function isDuplicateEmailError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return true;
    }
    if (error.code === 'P2010') {
      const dbCode = (error.meta as { code?: string } | undefined)?.code;
      return dbCode === '23505';
    }
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return msg.includes('unique') || msg.includes('duplicate key');
  }

  return false;
}

/**
 * Adds a new space to the database.
 * @param stuff, an object with the following properties: building name, room number,
 * occupancy, food allowed, noise level, and image.
 */
export async function addListing(data: {
  buildingName: string,
  roomNumber: string,
  occupancy: 'Empty' | 'Moderate' | 'Crowded',
  foodAllowed: 'Permitted' | 'Prohibited' | 'Water',
  noiseLevel: 'Quiet' | 'Moderate' | 'Loud',
  spaceType: 'Indoor' | 'Outdoor',
  capacity: number,
  image?: string,
}) {
  const newListing = await prisma.listing.create({
    data: {
      buildingName: data.buildingName,
      roomNumber: data.roomNumber,
      occupancy: data.occupancy,
      foodAllowed: data.foodAllowed,
      noiseLevel: data.noiseLevel,
      spaceType: data.spaceType,
      capacity: data.capacity,

      pictures: data.image
        ? {
            create: [
              {
                fileName: data.image,
              },
            ],
          }
        : undefined,
    },
  });

  redirect('/list');
}

export async function editListing(listing: { 
  listingID: number;
  buildingName: string; 
  roomNumber: string; 
  occupancy: Occupancy; 
  foodAllowed: FoodAllowed; 
  noiseLevel: NoiseLevel; 
  amenity: Amenity; 
  spaceType: SpaceType; 
  capacity: number 
}) {
  const editedListing = await prisma.listing.update({
    data: {
      buildingName: listing.buildingName,
      roomNumber: listing.roomNumber,
      occupancy: listing.occupancy,
      foodAllowed: listing.foodAllowed,
      noiseLevel: listing.noiseLevel,
      amenity: listing.amenity,
      spaceType: listing.spaceType,
      capacity: listing.capacity
    },
    where: { listingID: listing.listingID }
  });
  return editedListing;
}

/**
 * Edits an existing stuff in the database.
 * @param stuff, an object with the following properties: id, name, quantity, owner, condition.
 */
export async function editStuff(stuff: StuffItem) {
  // console.log(`editStuff data: ${JSON.stringify(stuff, null, 2)}`);
  await prisma.stuff.update({
    where: { id: stuff.id },
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition: stuff.condition,
    },
  });
  // After updating, redirect to the list page
  redirect('/list');
}

/**
 * Deletes an existing stuff from the database.
 * @param id, the id of the stuff to delete.
 */
export async function deleteStuff(id: number) {
  // console.log(`deleteStuff id: ${id}`);
  await prisma.stuff.delete({
    where: { id },
  });
  // After deleting, redirect to the list page
  redirect('/list');
}

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: fullName, email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const existing = await prisma.user.findUnique({ where: { email: credentials.email } });
  if (existing) {
    return { ok: false, code: 'EMAIL_EXISTS' } satisfies CreateUserResult;
  }

  const password = await hash(credentials.password, 10);
  let lastError: unknown;

  const attempts: Array<() => Promise<unknown>> = [
    () => prisma.user.create({
      data: {
        //fullName: credentials.fullName,
        email: credentials.email,
        password,
      },
    }),
    () => prisma.$executeRaw`
      INSERT INTO "User" ("email", "password")
      VALUES (${credentials.email}, ${password})
    `,
    // () => prisma.$executeRaw`
    //  INSERT INTO "User" ("fullName", "email", "password")
    //  VALUES (${credentials.fullName}, ${credentials.email}, ${password})
    //`,
    () => prisma.$executeRaw`
      INSERT INTO "User" ("email", "password")
      VALUES (${credentials.email}, ${password})
    `,
  ];

  for (const attempt of attempts) {
    try {
      await attempt();
      return { ok: true } satisfies CreateUserResult;
    } catch (error) {
      if (isDuplicateEmailError(error)) {
        return { ok: false, code: 'EMAIL_EXISTS' } satisfies CreateUserResult;
      }
      lastError = error;
    }
  }

  return {
    ok: false,
    code: 'UNKNOWN_ERROR',
    detail: getErrorDetail(lastError),
  } satisfies CreateUserResult;
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  // console.log(`changePassword data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}
