import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import ReviewForm from '@/components/ReviewForm';

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
      reviews: {
        include: {
          author: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
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
    <main className="listing-detail-page">
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
            <div className="space-detail-image mb-4" style={{ position: 'relative', width: '100%', height: 420, borderRadius: 12, overflow: 'hidden' }}>
              <Image
                src={listing.pictures?.[0]?.fileName || '/placeholder.jpg'}
                alt={listing.buildingName}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>
          </Col>

          <Col lg={5}>
            <div className="listing-content">
              <h1 className="listing-title">{listing.buildingName}</h1>
              <p className="listing-room">Room {listing.roomNumber}</p>
              <p className="listing-date">
                <strong>Listed on:</strong>{' '}
                {new Date(listing.createdAt).toLocaleDateString()}
              </p>

              <div className="listing-badges mb-3">
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

              <div className="listing-section">
                <h4 className="section-title">Details</h4>
                <dl className="details-list">
                  <dt>Noise Level:</dt>
                  <dd>{listing.noiseLevel}</dd>

                  <dt>Food Allowed:</dt>
                  <dd>{listing.foodAllowed}</dd>

                  <dt>Space Type:</dt>
                  <dd>{listing.spaceType}</dd>

                  <dt>Capacity:</dt>
                  <dd>{listing.capacity}</dd>
                </dl>
              </div>

              <div className="listing-section">
                <h4 className="section-title">Amenities</h4>
                {amenities.length ? (
                  <ul className="amenities-list">
                    {amenities.map((amenity) => (
                      <li key={amenity}>{amenity}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No amenities listed.</p>
                )}
              </div>

              <div className="listing-section">
                <h4 className="section-title">Available Times</h4>
                {times.length ? (
                  <ul className="times-list">
                    {times.map((time) => (
                      <li key={time}>{time}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No schedule information provided.</p>
                )}
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col lg={8}>
            <div className="mb-4">
              <h2>Student Reviews</h2>
              {listing.reviews.length ? (
                <>
                  <p className="text-muted">
                    {listing.reviews.length} review{listing.reviews.length === 1 ? '' : 's'}
                  </p>
                  <div className="review-list">
                    {listing.reviews.map((review) => {
                      const name = review.author.profile?.fullName || review.author.email || 'Anonymous';
                      return (
                        <div key={review.reviewID} className="review-card mb-3 p-3 border rounded bg-light">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong>{name}</strong>
                            <span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                          </div>
                          <p>{review.content}</p>
                          <p className="text-muted mb-0">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p className="text-muted">No reviews yet. Be the first to leave feedback.</p>
              )}
            </div>

            <ReviewForm listingId={listing.listingID} />
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ListingDetailPage;
