import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import fs from 'fs';
import path from 'path';

type Body = {
  fullName?: string;
  username?: string;
  major?: string;
  standing?: string;
  interests?: string;
  classes?: string;
  status?: string[] | string;
  pictureUrl?: string | null;
  removeImage?: boolean;
  email?: string;
};

async function saveDataUri(dataUri: string, destDir: string) {
  const matches = dataUri.match(/^data:(image\/(png|jpeg|jpg));base64,(.+)$/);
  if (!matches) return null;
  const ext = matches[2] === 'png' ? 'png' : 'jpg';
  const raw = matches[3];
  const buffer = Buffer.from(raw, 'base64');
  await fs.promises.mkdir(destDir, { recursive: true });
  const fileName = `profile-${Date.now()}.${ext}`;
  const filePath = path.join(destDir, fileName);
  await fs.promises.writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.email) return NextResponse.json({ message: 'Missing email' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

  // Save picture if provided
  let pictureFileName: string | undefined;
  if (body.pictureUrl && body.pictureUrl.startsWith('data:image/')) {
    try {
      const dest = path.join(process.cwd(), 'public', 'uploads');
      const saved = await saveDataUri(body.pictureUrl, dest);
      pictureFileName = saved ?? undefined;
    } catch (e) {
      // ignore save errors for now
    }
  } else if (body.pictureUrl) {
    // assume it's a URL or existing path
    pictureFileName = body.pictureUrl;
  }

  // If removeImage flag is set, delete existing profileImage rows and any uploaded files
  if ((body as any).removeImage) {
    try {
      const existing = await prisma.profileImage.findMany({ where: { profileID: user.id } });
      for (const img of existing) {
        if (img.fileName && img.fileName.startsWith('/uploads/')) {
          const filePath = path.join(process.cwd(), 'public', img.fileName.replace(/^\//, ''));
          try { await fs.promises.unlink(filePath); } catch (e) { /* ignore missing file */ }
        }
      }
      await prisma.profileImage.deleteMany({ where: { profileID: user.id } });
      // ensure we don't create a new image below
      pictureFileName = undefined;
    } catch (e) {
      // ignore errors
    }
  }

  try {
    await prisma.profile.upsert({
      where: { profileID: user.id },
      create: {
        id: user.id,
        profileID: user.id,
        fullName: body.fullName ?? '',
        major: body.major ?? '',
        classes: body.classes ?? '',
        Interests: body.interests ?? '',
        status: Array.isArray(body.status) ? body.status.join(', ') : (body.status as string) ?? '',
        standing: (body.standing as any) ?? 'Freshman',
      },
      update: {
        fullName: body.fullName ?? undefined,
        major: body.major ?? undefined,
        classes: body.classes ?? undefined,
        Interests: body.interests ?? undefined,
        status: Array.isArray(body.status) ? body.status.join(', ') : (body.status as string) ?? undefined,
        standing: (body.standing as any) ?? undefined,
      },
    });

    if (pictureFileName) {
      await prisma.profileImage.create({ data: { profileID: user.id, fileName: pictureFileName } });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown';
    return NextResponse.json({ message: `DB error: ${detail}` }, { status: 500 });
  }
}
