'use client';

import { useState } from 'react';
import { Container, Form, Row, Col } from 'react-bootstrap';
import SpaceCard from '@/components/SpaceCard';

/**
 * Type definition for single Listing object coming from Prisma.
*/
type Listing = {
  listingID: number;
  buildingName: string;
  roomNumber: string;
  occupancy: string;
  noiseLevel: string;
  foodAllowed: string;
  spaceType: string;
  capacity: number;
};

// listings: array of Listing objects fetched from the database 
type SpaceCardProps = {
  listings: Listing[];
};

const SpaceListClient = ({ listings }: SpaceCardProps) => {
  /**
   * search = state variable to hold the current search query for filtering listings by building name.
   * setSearch = function to update the search state variable when the user types in the search bar.
   */
  const [search, setSearch] = useState('');

  const filteredListings = listings.filter((listing) =>
    listing.buildingName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      {/* Search bar */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            className="space-search"
            type="text"
            placeholder="Search by building name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Col>
      </Row>

      {/* Cards */}
      <Row>
        <Col>
          {filteredListings.map((listing) => (
            <SpaceCard key={listing.listingID} listing={listing} />
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default SpaceListClient;