"use client";

import { useEffect, useState } from 'react';
import SpaceCard, { Listing } from '@/components/SpaceCard';
import { Container, Row, Col } from 'react-bootstrap';

export default function AddedSpacesClient() {
  const [emailKey, setEmailKey] = useState<string | null>(null);
  const [ids, setIds] = useState<number[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const keys = Object.keys(window.localStorage).filter((k) => k.startsWith('profile:'));
    for (const k of keys) {
      try {
        const raw = window.localStorage.getItem(k) || '{}';
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const added = (parsed.addedSpaces as number[] | undefined) ?? [];
        if (added.length > 0) {
          Promise.resolve().then(() => {
            setEmailKey(k.replace('profile:', ''));
            setIds(added);
          });
          return;
        }
      } catch {
        // ignore
      }
    }

    const rawAnon = window.localStorage.getItem('profile:anonymous');
    if (rawAnon) {
      try {
        const parsed = JSON.parse(rawAnon) as Record<string, unknown>;
        const added = (parsed.addedSpaces as number[] | undefined) ?? [];
        if (added.length > 0) {
          Promise.resolve().then(() => {
            setEmailKey('anonymous');
            setIds(added);
          });
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!ids || ids.length === 0) return;
    const qs = ids.join(',');
    fetch(`/api/listings?ids=${qs}`).then((res) => res.json()).then((data) => {
      setListings(data.listings || []);
    }).catch(() => {});
  }, [ids]);

  if (!ids || ids.length === 0) {
    return <p className="muted">No added spaces</p>;
  }

  return (
    <Container fluid>
      <Row xs={1} md={2} className="g-3">
        {listings.map((listing) => (
          <Col key={listing.listingID}>
            <SpaceCard listing={listing} href={`/list/${listing.listingID}`} email={emailKey ?? undefined} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
