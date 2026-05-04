'use server';

import { hash } from 'bcrypt';
import { Prisma, Amenity } from '@prisma/client';
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
 * @param data, an object with building info, space details, image, and amenities.
 */
export async function addListing(data: {
  buildingName: string;
  roomNumber: string;
  occupancy: 'Empty' | 'Moderate' | 'Crowded';
  foodAllowed: 'Permitted' | 'Prohibited' | 'Water';
  noiseLevel: 'Quiet' | 'Moderate' | 'Loud';
  spaceType: 'Indoor' | 'Outdoor';
  capacity: number;
  image?: string;
  amenities: Amenity[];
}) {

  console.log('addListing HIT');
  console.log('amenities received:', data.amenities);

  const { amenities, image, ...listingData } = data;

  const newListing = await prisma.listing.create({
    data: {
      ...listingData,
      pictures: image
        ? {
            create: [{ fileName: image }],
          }
        : undefined,
    },
  });

  if (amenities.length > 0) {
    console.log('querying AmenityEntity with:', amenities);
    const amenityRecords = await prisma.amenityEntity.findMany({
      where: {
        name: {
          in: amenities,
        },
      },
    });

    await prisma.listingAmenity.createMany({
      data: amenityRecords.map((record) => ({
        listingID: newListing.listingID,
        amenityID: record.id,
      })),
    });
  }

  redirect('/list');
}

/**
 * Creates a new study group in the database.
 */
export async function createStudyGroup(data: {
  title: string;
  course: string;
  description?: string;
  location: string;
  startTime: string | Date;
  endTime: string | Date;
  capacity: number;
  organizerId: number;
}) {
  await prisma.studyGroup.create({
    data: {
      title: data.title,
      course: data.course,
      description: data.description,
      location: data.location,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      capacity: data.capacity,
      organizerId: data.organizerId,
    },
  });
}

/**
 * Joins study group in the database.
 */
export async function joinStudyGroup(data: {
  groupId: number;
  userId: number;
}) {
  await prisma.groupMember.create({
    data: {
      groupId: data.groupId,
      userId: data.userId,
    },
  });
}

/**
 * Leaves study group in the database.
 */
export async function leaveStudyGroup(data: {
  groupId: number;
  userId: number;
}) {
  await prisma.groupMember.delete({
    where: {
      groupId_userId: {
        groupId: data.groupId,
        userId: data.userId,
      },
    },
  });
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
 * Retrieves all listings created today. Filters listings based on the current date 
 * (from midnight to 11:59 PM) and includes associated images for display in the UI. 
 * @param The date used to filter listings (typically today's date).
 * @returns An array of Listing objects created today, each including its pictures.
 */
export async function getTodayListings() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);     // 12:00:00.000 AM (start of today)
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);  // 11:59:59.999 PM (end of today)

  return prisma.listing.findMany({
    where: {
      createdAt: {
        gte: startOfDay,  // greater than or equal to start of today
        lte: endOfDay,    // less than or equal to before end of today
      },
    },
    include: {
      pictures: true,
    },
    orderBy: {
      createdAt: 'desc',  // Show newest listings first (descending order)
    },
  });
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

/**
 * Creates a Profile row and optional ProfileImage for an existing user.
 * This function deliberately sets the Profile primary key `profileID` to the
 * existing user's id so the two ids match (no schema changes required).
 *
 * Notes:
 * - `profileID` in the Prisma schema is an autoincrementing primary key, but
 *   Postgres allows explicitly inserting a value for it. We catch duplicate
 *   key errors and return a friendly result.
 */
export async function createProfileForUser(opts: {
  userId: number;
  fullName?: string;
  major?: string;
  classes?: string;
  interests?: string;
  status?: string;
  standing?: 'Freshman' | 'Sophmore' | 'Junior' | 'Senior' | 'Graduate' | 'Other';
  pictureFileName?: string;
}) {
  try {
    await prisma.profile.create({
      data: {
        // Provide the legacy `id` column (required by the current schema) and
        // set it equal to the user id so the two ids match.
        id: opts.userId,
        // Set the profile primary key equal to the user id so they match
        profileID: opts.userId,
        fullName: opts.fullName ?? '',
        major: opts.major ?? '',
        classes: opts.classes ?? '',
        Interests: opts.interests ?? '',
        status: opts.status ?? '',
        standing: opts.standing ?? 'Freshman',
        picture: opts.pictureFileName
          ? {
              create: [
                {
                  fileName: opts.pictureFileName,
                },
              ],
            }
          : undefined,
      },
    });

    return { ok: true } as const;
  } catch (error) {
    // If the profile already exists (duplicate primary key), return a clear code
    if (isDuplicateEmailError(error) || (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')) {
      return { ok: false, code: 'PROFILE_EXISTS', detail: getErrorDetail(error) } as const;
    }

    return { ok: false, code: 'UNKNOWN_ERROR', detail: getErrorDetail(error) } as const;
  }
}
