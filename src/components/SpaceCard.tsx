'use client';

import Link from 'next/link';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import { Row, Col } from 'react-bootstrap';

export type Listing = {
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
      name: string;
    };
  }[];
};

type SpaceCardProps = {
  listing: Listing;
  href?: string;
  email?: string;
};

const SpaceCard = ({ listing, href, email }: SpaceCardProps) => {
  // Map enum names to display names
  const amenityDisplayNames: Record<string, string> = {
    Outlets: 'Outlets',
    AirConditioning: 'Air Conditioning',
    WiFi: 'WiFi',
    Printing: 'Printing',
    Whiteboards: 'Whiteboards',
    ReservableRooms: 'Reservation Req.',
    Accessible: 'Accessibility',
    WaterRefill: 'Water Refill',
  };

  const card = (
    <Card className="space-card" style={{ position: 'relative' }}>
      <Card.Body>
        <Row className="align-items-start">
          {/* Card Content */}
          <Col xs style={{ minWidth: 0, flexGrow: 1 }}>
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
          <Col xs="auto" className="d-flex justify-content-end align-items-start" style={{ minWidth: 0, flexShrink: 0 }}>
            <Image
              src={listing.pictures?.[0]?.fileName || '/placeholder.jpg'}
              alt={listing.buildingName}
              width={180}
              height={180}
              className="space-card-image"
              style={{ objectFit: 'cover' }}
            />
          </Col>
        </Row>

        {/* Amenities underneath */}
        {listing.amenities?.length > 0 && (
          <Row>
            <Col>
              <div className="amenities-container">
                {listing.amenities.map((a, index) => (
                  <span key={index} className="amenity-badge">
                    {amenityDisplayNames[a.amenity.name] || a.amenity.name}
                  </span>
                ))}
              </div>
            </Col>
          </Row>
        )}
        {/* Bookmark button bottom-right */}
        <div style={{ position: 'absolute', right: 12, bottom: 12, zIndex: 20 }}> 
          <BookmarkButton listingID={listing.listingID} email={email} />
        </div>
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

// BookmarkButton component (small, local-only persistence via profile:{email} in localStorage)
import { useEffect, useState } from 'react';

function BookmarkButton({ listingID, email }: { listingID: number; email?: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!email) return;
    try {
      const raw = window.localStorage.getItem(`profile:${email}`);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const savedSpaces = (parsed?.savedSpaces as number[] | undefined) ?? [];
      // defer state update to avoid setState-in-effect lint error
      Promise.resolve().then(() => setSaved(savedSpaces.includes(listingID)));
    } catch {
      // ignore
    }
  }, [email, listingID]);

  function toggle(e: React.MouseEvent) {
    // Prevent parent link navigation
    e.stopPropagation();
    e.preventDefault();

    if (!email) {
      // if no email known, show a quick fallback: use 'anonymous' key
      // but it's better to require login; for now, use 'anonymous'
    }

    const key = `profile:${email ?? 'anonymous'}`;
    try {
      const raw = window.localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : {};
      const savedSpaces: number[] = parsed.savedSpaces && Array.isArray(parsed.savedSpaces) ? parsed.savedSpaces : [];

      const idx = savedSpaces.indexOf(listingID);
      if (idx === -1) {
        savedSpaces.push(listingID);
        setSaved(true);
      } else {
        savedSpaces.splice(idx, 1);
        setSaved(false);
      }

      const newProfile = { ...(parsed || {}), savedSpaces };
      window.localStorage.setItem(key, JSON.stringify(newProfile));
    } catch {
      // ignore
    }
  }

  return (
    // simple button: filled/outline bookmark emoji
    <button
      className={`bookmark-btn ${saved ? 'saved' : ''}`}
      onClick={toggle}
      aria-pressed={saved}
      title={saved ? 'Unsave space' : 'Save space'}
      style={{
        border: 'none',
        background: 'transparent',
        padding: '6px',
        borderRadius: 6,
        cursor: 'pointer',
        boxShadow: 'none',
        fontSize: 18,
        lineHeight: 1,
        zIndex: 30
      }}
    >
      {/* Bookmark SVG: outline when not saved, filled when saved */}
      {saved ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ color: '#f6c94d' }}>
          <path d="M6 2a1 1 0 0 0-1 1v18l7-4 7 4V3a1 1 0 0 0-1-1H6z" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: '#6b6b6b' }}>
          <path d="M6 2h12a1 1 0 0 1 1 1v18l-7-4-7 4V3a1 1 0 0 1 1-1z" />
        </svg>
      )}
      <span className="visually-hidden">{saved ? 'Unsave space' : 'Save space'}</span>
    </button>
  );
}