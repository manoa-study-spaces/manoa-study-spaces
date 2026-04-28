import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createProfileForUser } from '@/lib/dbActions';

type SignUpRequestBody = {
  //fullName?: string;
  email?: string;
  password?: string;
};

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

function isDuplicateError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return true;
    }

    if (error.code === 'P2010') {
      const meta = error.meta as {
        code?: string;
        driverAdapterError?: { cause?: { originalCode?: string; kind?: string } };
      } | undefined;

      const dbCode = meta?.code;
      const adapterCode = meta?.driverAdapterError?.cause?.originalCode;
      const adapterKind = meta?.driverAdapterError?.cause?.kind;

      return dbCode === '23505' || adapterCode === '23505' || adapterKind === 'UniqueConstraintViolation';
    }
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return msg.includes('unique') || msg.includes('duplicate key');
  }

  return false;
}

export async function POST(request: Request) {
  let body: SignUpRequestBody;

  try {
    body = (await request.json()) as SignUpRequestBody;
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  try {
    //const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const passwordRaw = typeof body.password === 'string' ? body.password : '';

    //if (!fullName || !email || !passwordRaw) {
      //return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    //}

    if ( !email || !passwordRaw) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    const password = await hash(passwordRaw, 10);

    //const attempts: Array<() => Promise<unknown>> = [
     // () => prisma.user.create({ data: { fullName, email, password } }),
      //() => prisma.$executeRaw`
      //  INSERT INTO "User" ("fullName", "email", "password", "role")
      //  VALUES (${fullName}, ${email}, ${password}, 'USER')
      //`,
     // () => prisma.$executeRaw`
     //   INSERT INTO "User" ("fullName", "email", "password")
     //   VALUES (${fullName}, ${email}, ${password})
     // `,
     // () => prisma.$executeRaw`
     //   INSERT INTO "User" ("email", "password", "role")
     //   VALUES (${email}, ${password}, 'USER')
     // `,
     // () => prisma.$executeRaw`
     //   INSERT INTO "User" ("email", "password")
      //  VALUES (${email}, ${password})
     // `,
    //];

       const attempts: Array<() => Promise<unknown>> = [
      () => prisma.user.create({ data: { email, password } }),
      () => prisma.$executeRaw`
        INSERT INTO "User" ("email", "password", "role")
        VALUES (${email}, ${password}, 'USER')
      `,
      () => prisma.$executeRaw`
        INSERT INTO "User" ("email", "password")
        VALUES (${email}, ${password})
      `,
      () => prisma.$executeRaw`
        INSERT INTO "User" ("email", "password", "role")
        VALUES (${email}, ${password}, 'USER')
      `,
      () => prisma.$executeRaw`
        INSERT INTO "User" ("email", "password")
        VALUES (${email}, ${password})
      `,
    ];

    let lastError: unknown;

    for (const attempt of attempts) {
      try {
        // create the user
        const result = await attempt();

        // If attempt used prisma.user.create it will return the created row.
        // For raw SQL attempts, fetch the created user by email so we can get its id.
        let userId: number | null = null;
        if (result && typeof result === 'object' && 'id' in (result as any)) {
          userId = (result as any).id as number;
        } else {
          const u = await prisma.user.findUnique({ where: { email } });
          userId = u ? u.id : null;
        }

        // If we have a user id, create a matching profile row so both tables contain the entry
        if (userId) {
          // picture filename is not available here; we only have pictureUrl from the body
          // For now create profile with provided fullName if present (body may not have all fields).
          // Note: body may include more fields; attempt to use them if provided.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const bodyAny = body as any;
          const profileRes = await createProfileForUser({
            userId,
            fullName: typeof bodyAny.fullName === 'string' ? bodyAny.fullName : '',
            major: typeof bodyAny.major === 'string' ? bodyAny.major : undefined,
            classes: typeof bodyAny.classes === 'string' ? bodyAny.classes : undefined,
            interests: typeof bodyAny.interests === 'string' ? bodyAny.interests : undefined,
            status: typeof bodyAny.status === 'string' ? bodyAny.status : undefined,
            standing: typeof bodyAny.standing === 'string' ? (bodyAny.standing as any) : undefined,
            // If the client sent a pictureUrl (data URI or URL), save it as the fileName so
            // a ProfileImage row is created. This keeps the data available in the DB until
            // we add proper storage handling.
            pictureFileName: typeof bodyAny.pictureUrl === 'string' ? bodyAny.pictureUrl : undefined,
          });

          if (!profileRes.ok && profileRes.code === 'UNKNOWN_ERROR') {
            return NextResponse.json({ message: `Account created but profile creation failed: ${profileRes.detail}` }, { status: 500 });
          }
        }

        return NextResponse.json({ ok: true }, { status: 201 });
      } catch (error) {
        if (isDuplicateError(error)) {
          return NextResponse.json({ message: 'Email already exists.' }, { status: 409 });
        }
        lastError = error;
      }
    }

    return NextResponse.json(
      { message: `Could not create account. ${getErrorDetail(lastError)}` },
      { status: 500 },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ message: `Could not create account. ${detail}` }, { status: 500 });
  }
}
