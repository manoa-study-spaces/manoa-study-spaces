'use client';

import Card from 'react-bootstrap/Card';

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
  };
};

const SpaceCard = ({ listing }: SpaceCardProps) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title>{listing.buildingName}</Card.Title>

        <Card.Subtitle className="mb-2 text-muted">
          Room {listing.roomNumber}
        </Card.Subtitle>

        <div>
          <p><strong>Occupancy:</strong> {listing.occupancy}</p>
          <p><strong>Noise Level:</strong> {listing.noiseLevel}</p>
          <p><strong>Food:</strong> {listing.foodAllowed}</p>
          <p><strong>Type:</strong> {listing.spaceType}</p>
          <p><strong>Capacity:</strong> {listing.capacity}</p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SpaceCard;