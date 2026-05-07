import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const idsParam = url.searchParams.get('ids');
  if (!idsParam) return NextResponse.json({ listings: [] });

  const ids = idsParam.split(',').map((s) => Number(s)).filter(Boolean);
  if (ids.length === 0) return NextResponse.json({ listings: [] });

  const listings = await prisma.listing.findMany({
    where: { listingID: { in: ids } },
    include: { pictures: true, amenities: { include: { amenity: true } } },
  });

  return NextResponse.json({ listings });
}
