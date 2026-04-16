'use server';

import { Condition } from '@prisma/client';
import { Stuff } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';

/**
 * Adds a new stuff to the database.
 * @param stuff, an object with the following properties: name, quantity, owner, condition.
 */
export async function addStuff(listing: { listingID: number; buildingName: string; roomNumber: string; times: string; pictures: string; occupancy: string; foodAllowed: string; noiseLevel: string }) {
  // console.log(`addStuff data: ${JSON.stringify(stuff, null, 2)}`);

  let occupancy: Occupancy = 'moderate';
  if (listing.occupancy === 'crowded') {
    occupancy = 'crowded';
  } else
    occupancy = 'empty';

  let foodAllowed: FoodAllowed = 'prohibited';
  if (listing.foodAllowed === 'permitted') {
    foodAllowed = 'permitted';
  } else {
    foodAllowed = 'water okay';
  }

  let noiseLevel: NoiseLevel = 'moderate';
  if (listing.noiseLevel === 'quiet') {
    noiseLevel = 'quiet';
  } else if (listing.noiseLevel === 'loud') {
    noiseLevel = 'loud';
  }

  let occupancy: Occupancy = 'moderate';
  if (listing.occupancy === 'crowded') {
    occupancy = 'crowded';
  } else
    occupancy = 'empty';


  }


  await prisma.stuff.create({
    data: {
      buildingName: listing.buildingName,
      roomNumber: listing.roomNumber,
      times: listing.times,
      pictures: listing.pictures,
      occupancy,
      foodAllowed,
      noiseLevel,
    },
  });
  // After adding, redirect to the list page
  redirect('/list');
}

/**
 * Edits an existing stuff in the database.
 * @param stuff, an object with the following properties: id, name, quantity, owner, condition.
 */
export async function editStuff(stuff: Stuff) {
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
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
    },
  });
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
