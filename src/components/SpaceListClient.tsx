'use client';

import { useState } from 'react';
import { Container, Form, Row, Col } from 'react-bootstrap';
import SpaceCard from '@/components/SpaceCard';
import { InputGroup, Button } from 'react-bootstrap';
import { LiaTimesSolid } from "react-icons/lia";
import { CiSearch } from "react-icons/ci";
import { usePathname } from 'next/navigation';

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
  createdAt: string | Date;
  pictures: {
    imageID: number;
    fileName: string;
  }[];
  amenities: {
    amenity: {
      id: number;
      name: string;
    };
  }[];
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
  const pathName = usePathname();

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col className="d-flex align-items-center">

          {/* Search Bar */}
          <InputGroup style={{ maxWidth: '700px', width: '100%' }}>
            <InputGroup.Text>
              <CiSearch />
            </InputGroup.Text>

            <Form.Control
              className="space-search"
              type="text"
              placeholder="Search by building name..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {search && (
              <Button
                variant="outline-secondary"
                onClick={() => setSearch('')}
              >
                <LiaTimesSolid />
              </Button>
            )}
          </InputGroup>

          {/* Add Space Button */}
          <Button variant="success" className="add-space-btn ms-3" href="/add" active={pathName === '/add'}>
            + Add Space
          </Button>
        </Col>
      </Row>

      {/* Cards */}
      <Row xs={1} md={2} className="g-3">
        {filteredListings.map((listing) => (
          <Col key={listing.listingID}>
            <SpaceCard listing={listing} href={`/list/${listing.listingID}`} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SpaceListClient;