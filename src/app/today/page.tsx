import SpaceCard from '@/components/SpaceCard';
import { prisma } from '@/lib/prisma';
import { Container, Row, Col } from 'react-bootstrap';
import { DateTime } from 'luxon';

export default async function TodayPage() {
  // Current time in Hawaii (safe, no string parsing)
  const hawaiiNow = DateTime.now().setZone('Pacific/Honolulu');

  // Format date for display
  const formattedDate = hawaiiNow.toFormat('EEEE, MMMM d, yyyy');

  // Start of today in Hawaii
  const startOfToday = hawaiiNow.startOf('day').toJSDate();

  // Start of tomorrow in Hawaii
  const startOfTomorrow = hawaiiNow
    .plus({ days: 1 })
    .startOf('day')
    .toJSDate();

  // Time Test
  console.log("Now (server UTC):", new Date().toISOString());
  console.log("startOfToday:", startOfToday.toISOString());
  console.log("startOfTomorrow:", startOfTomorrow.toISOString());
  console.log("formattedDate:", formattedDate);

  const listings = await prisma.listing.findMany({
    where: {
      createdAt: {
        gte: startOfToday,
        lt: startOfTomorrow,
      },
    },
    include: {
      pictures: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main className="p-4 today-spaces">
      <h1>Today&apos;s Spaces</h1>
      <p>{formattedDate}</p>

      {listings.length === 0 ? (
        <p className="text-muted">No created spaces today</p>
      ) : (
        <Container fluid className="mt-3">
          <Row xs={1} md={2} className="g-3">
            {listings.map((listing) => (
              <Col key={listing.listingID}>
                <SpaceCard listing={listing} href={`/list/${listing.listingID}`} />
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </main>
  );
}
