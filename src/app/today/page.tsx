import SpaceCard from '@/components/SpaceCard';
import { prisma } from '@/lib/prisma';
import { Container, Row, Col } from 'react-bootstrap';

export default async function TodayPage() {
  const today = new Date();

  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

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
                <SpaceCard listing={listing} />
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </main>
  );
}