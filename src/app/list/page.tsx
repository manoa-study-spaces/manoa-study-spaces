export const dynamic = 'force-dynamic';

import { Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import SpaceListClient from '@/components/SpaceListClient';

/** Render a list of stuff for the logged in user. */
const ListPage = async () => {
  // Protect the page, only logged in users can access it.
  const session = await auth();
  
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  const listings = await prisma.listing.findMany({
  include: {
      pictures: true,
    },
  });
  // Test Listing
//   const listings = [
//   {
//     listingID: 1,
//     buildingName: 'Hamilton Library',
//     roomNumber: '1st Floor Addition',
//     occupancy: 'Moderate',
//     noiseLevel: 'Quiet',
//     foodAllowed: 'Prohibited',
//     spaceType: 'Indoor',
//     capacity: 50,
//     image: '/hamilton.jpg',
//   },
//   {
//     listingID: 2,
//     buildingName: 'Paradise Palms',
//     roomNumber: 'N/A',
//     occupancy: 'Crowded',
//     noiseLevel: 'Loud',
//     foodAllowed: 'Permitted',
//     spaceType: 'Indoor',
//     capacity: 80,
//     image: '/paradise-palms.jpg',
//   },
//   {
//     listingID: 3,
//     buildingName: 'Sustainability Courtyard',
//     roomNumber: 'N/A',
//     occupancy: 'Empty',
//     noiseLevel: 'Moderate',
//     foodAllowed: 'Permitted',
//     spaceType: 'Outdoor',
//     capacity: 30,
//     image: '/sustainability-courtyard.jpg',
//   },
// ];

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
