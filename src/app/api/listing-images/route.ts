import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/* eslint-disable import/prefer-default-export */
export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const listingID = Number(formData.get('listingID'));
  const imageFiles = formData.getAll('Image') as File[];

  if (Number.isNaN(listingID)) {
    return NextResponse.json({ error: 'Invalid listingID' }, { status: 400 });
  }

  const createdImages = [];

  /* eslint-disable no-await-in-loop */
  for (const file of imageFiles) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const created = await prisma.image.create({
      data: {
        listingID: listingID,
        fileName: file.name,
        MIMEType: file.type,
        Data: buffer,
      },
    });
    /* eslint-enable no-await-in-loop */

    createdImages.push(created.imageID);
  }

  return NextResponse.json({ ok: true, images: createdImages });
}
