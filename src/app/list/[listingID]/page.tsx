import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

type ListingDetailProps = {
  params: Promise<{
    listingID: string;
  }>;
};

const ListingDetailPage = async ({ params }: ListingDetailProps) => {
  const session = await auth();
  loggedInProtectedPage(session as { user: { email: string; id: string; name: string } } | null);

  const { listingID } = await params;
  const id = Number(listingID);
  if (Number.isNaN(id)) {
    notFound();
  }

  const listing = await prisma.listing.findUnique({
    where: { listingID: id },
    include: {
      pictures: true,
      times: true,
      amenities: {
        include: {
          amenity: true,
        },
      },
    },
  });

  if (!listing) {
    notFound();
  }

  const amenities = listing.amenities.map((item) => item.amenity.name);
  const times = listing.times.map((time) => `${time.startTime} — ${time.endTime}`);

  return (
    <main className="p-4">
      <Container>
        <Row className="mb-4">
          <Col>
            <Link href="/list" className="btn btn-secondary">
              ← Back to Study Spaces
            </Link>
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={7}>
            <div className="space-detail-image mb-4">
              <img
                src={listing.pictures?.[0]?.fileName || '/placeholder.jpg'}
                alt={listing.buildingName}
                style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', maxHeight: '420px' }}
              />
            </div>
          </Col>

          <Col lg={5}>
            <h1>{listing.buildingName}</h1>
            <p className="text-muted">Room {listing.roomNumber}</p>
            <p>
              <strong>Listed on:</strong>{' '}
              {new Date(listing.createdAt).toLocaleDateString()}
            </p>

            <div className="mb-3">
              <Badge bg="success" className="me-2">
                {listing.spaceType}
              </Badge>
              <Badge bg="info" className="me-2">
                Capacity: {listing.capacity}
              </Badge>
              <Badge bg="secondary" className="me-2">
                {listing.occupancy}
              </Badge>
            </div>

            <div className="mb-4">
              <h4>Details</h4>
              <dl className="row">
                <dt className="col-sm-5">Noise Level:</dt>
                <dd className="col-sm-7">{listing.noiseLevel}</dd>

                <dt className="col-sm-5">Food Allowed:</dt>
                <dd className="col-sm-7">{listing.foodAllowed}</dd>

                <dt className="col-sm-5">Space Type:</dt>
                <dd className="col-sm-7">{listing.spaceType}</dd>

                <dt className="col-sm-5">Capacity:</dt>
                <dd className="col-sm-7">{listing.capacity}</dd>
              </dl>
            </div>

            <div className="mb-4">
              <h4>Amenities</h4>
              {amenities.length ? (
                <ul>
                  {amenities.map((amenity) => (
                    <li key={amenity}>{amenity}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No amenities listed.</p>
              )}
            </div>

            <div>
              <h4>Available Times</h4>
              {times.length ? (
                <ul>
                  {times.map((time) => (
                    <li key={time}>{time}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No schedule information provided.</p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ListingDetailPage;
