import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const idsParam = url.searchParams.get('ids');
  if (!idsParam) return NextResponse.json({ groups: [] });

  const ids = idsParam.split(',').map((s) => Number(s)).filter(Boolean);
  if (ids.length === 0) return NextResponse.json({ groups: [] });

  const groups = await prisma.studyGroup.findMany({
    where: { groupID: { in: ids } },
  });

  return NextResponse.json({ groups });
}
