'use server';

import { Condition } from '@prisma/client';
import { Stuff } from '@prisma/client';
import { Listing } from '@prisma/client'; 
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
 * Adds a new stuff to the database.
 * @param stuff, an object with the following properties: name, quantity, owner, condition.
 */
export async function addStuff(stuff: { name: string; quantity: number; owner: string; condition: string }) {
  // console.log(`addStuff data: ${JSON.stringify(stuff, null, 2)}`);
  let condition: StuffCondition = 'good';
  if (stuff.condition === 'poor') {
    condition = 'poor';
  } else if (stuff.condition === 'excellent') {
    condition = 'excellent';
  } else {
    condition = 'fair';
  }
  await prisma.stuff.create({
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition,
    },
  });
  // After adding, redirect to the list page
  redirect('/list');
}

/**
 * 
 * @param listing 
 */
export async function addListing(listing: { 
  buildingName: string; 
  roomNumber: string; 
  times: string; 
  pictures: string; 
  occupancy: string; 
  foodAllowed: string; 
  noiseLevel: string; 
  amenities: string; 
  spaceType: string; 
  capacity: number 
}) {
  await prisma.listing.create({
    data: {
      buildingName: listing.buildingName,
      roomNumber: listing.roomNumber,
      times: listing.times, 
      pictures: listing.pictures,
      occupancy: listing.occupancy,
      foodAllowed: listing.foodAllowed,
      noiseLevel: listing.noiseLevel,
      amenities: listing.amenities,
      spaceType: listing.spaceType,
      capacity: listing.capacity
    },
  });
  redirect('list'); 
}

export async function editListing(listing: Listing) {
  await prisma.contact.update({
    where: { id: listing.id }, 
    data: {
      buildingName: listing.buildingName,
      roomNumber: listing.roomNumber,
      times: listing.times,
      pictures: listing.pictures,
      occupancy: listing.occupancy,
      foodAllowed: listing.foodAllowed,
      noiseLevel: listing.noiseLevel,
      amenities: listing.amenities,
      spaceType: listing.spaceType,
      capacity: listing.capacity,
    },
  }); 
  redirect('/list');
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
