'use client';

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
};

const SpaceCard = ({ listing }: SpaceCardProps) => {
  return (
    <Card className="space-card">
      <Card.Body>

        <Row>
          {/* Card Content */}
          <Col xs={8} md={8}>
            <Card.Title>{listing.buildingName}</Card.Title>

            <Card.Subtitle className="mb-2 pb-2 border-bottom d-flex justify-content-between">
              <span>Room {listing.roomNumber}</span>
              <span className="text-muted">
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
          <Col xs={4} md={4} className="d-flex justify-content-end align-items-start">
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
};

export default SpaceCard;