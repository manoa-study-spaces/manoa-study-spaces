'use client';

import Link from 'next/link';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import { Row, Col } from 'react-bootstrap';

type SpaceCardProps = {
  listing: {
    listingID: number;
    buildingName: string;
    roomNumber: string;
    occupancy: string;
    noiseLevel: string;
    foodAllowed: string;
    spaceType: string;
    capacity: number;
    createdAt: string | Date;
    pictures: {
      imageID: number;
      fileName: string;
    }[];
  };
  href?: string;
};

const SpaceCard = ({ listing, href }: SpaceCardProps) => {
  const card = (
    <Card className="space-card">
      <Card.Body>
        <Row className="align-items-start">
          {/* Card Content */}
          <Col xs={12} md style={{ minWidth: 0 }}>
            <Card.Title>{listing.buildingName}</Card.Title>

            <Card.Subtitle className="mb-2 pb-2 border-bottom d-flex justify-content-between" style={{ minWidth: 0 }}>
              <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>Room {listing.roomNumber}</span>
              <span className="text-muted" style={{ whiteSpace: 'nowrap' }}>
                {new Date(listing.createdAt).toLocaleDateString()}
              </span>
            </Card.Subtitle>

            <p><strong>Occupancy:</strong> {listing.occupancy}</p>
            <p><strong>Noise Level:</strong> {listing.noiseLevel}</p>
            <p><strong>Food:</strong> {listing.foodAllowed}</p>
            <p><strong>Type:</strong> {listing.spaceType}</p>
            <p><strong>Capacity:</strong> {listing.capacity}</p>
          </Col>

          {/* Image */}
          <Col xs={12} md="auto" className="d-flex justify-content-end align-items-start" style={{ minWidth: 0, flexShrink: 0 }}>
            <Image
              src={listing.pictures?.[0]?.fileName || '/placeholder.jpg'}
              alt={listing.buildingName}
              width={200}
              height={200}
              style={{ borderRadius: '8px', objectFit: 'cover' }}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  if (!href) {
    return card;
  }

  return (
    <Link href={href} className="text-decoration-none text-dark" style={{ display: 'block' }}>
      {card}
    </Link>
  );
};

export default SpaceCard;