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

  const listings = await prisma.listing.findMany();

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

export default ListPage