import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type SignUpRequestBody = {
  fullName?: string;
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
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const passwordRaw = typeof body.password === 'string' ? body.password : '';

    if (!fullName || !email || !passwordRaw) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    const password = await hash(passwordRaw, 10);

    const attempts: Array<() => Promise<unknown>> = [
      () => prisma.user.create({ data: { fullName, email, password } }),
      () => prisma.$executeRaw`
        INSERT INTO "User" ("fullName", "email", "password", "role")
        VALUES (${fullName}, ${email}, ${password}, 'USER')
      `,
      () => prisma.$executeRaw`
        INSERT INTO "User" ("fullName", "email", "password")
        VALUES (${fullName}, ${email}, ${password})
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
        await attempt();
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
