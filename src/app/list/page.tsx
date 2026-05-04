export const dynamic = 'force-dynamic';

import { Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import SpaceListClient from '@/components/SpaceListClient';

/**
 * Page that renders all listings for logged-in users.
 */
const ListPage = async () => {
  // Protect route
  const session = await auth();

  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  /**
   * IMPORTANT FIX:
   * We must include amenities + nested amenity entity
   * or TypeScript + UI will break.
   */
  const listings = await prisma.listing.findMany({
    include: {
      pictures: true,
      amenities: {
        include: {
          amenity: true,
        },
      },
    },
  });

  return (
    <main>
      <Container id="list" fluid className="py-3">
        <Row>
          <Col>
            <SpaceListClient listings={listings} />
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ListPage;