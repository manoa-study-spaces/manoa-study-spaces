export const dynamic = 'force-dynamic';

import { Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import StudyGroupClient from '@/components/StudyGroupClient';

/**
 * Groups Page - shows all study groups
 */
const GroupsPage = async () => {
  const session = await auth();

  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const groups = await prisma.listing.findMany({
    include: {
      pictures: true,
    },
  });

// const studyGroups = groups.map((listing) => {
//   const start = new Date();

//   return {
//     groupID: listing.listingID,
//     title: `${listing.buildingName} Study Session`,
//     course: 'ICS 314',
//     location: `${listing.buildingName} - Room ${listing.roomNumber}`,
//     startTime: start.toISOString(),
//     endTime: new Date(start.getTime() + 2 * 60 * 60 * 1000).toISOString(),
//     capacity: listing.capacity,
//     members: Math.max(1, listing.capacity - 2),
//     createdAt: listing.createdAt.toString(),
//   };
// });

// Test Study Groups
// This mock data simulates study groups shown in the Study Groups page.

const studyGroups = [
  {
    groupID: 1,
    title: 'ICS 314 Final Project Work Session',
    course: 'ICS 314',
    description: 'Collaborating on final project and helping resolve issues regarding databases.',
    location: 'Hamilton Library - 3rd Floor',
    startTime: '2026-04-25T15:00:00.000Z',
    endTime: '2026-04-25T17:00:00.000Z',
    capacity: 6,
    members: 3,
    createdAt: '2026-04-25T10:00:00.000Z',
  },
  {
    groupID: 2,
    title: 'ICS 212 Homework Help',
    course: 'ICS 212',
    description: 'Working through linked lists and pointers together.',
    location: 'POST Building - Room 302',
    startTime: '2026-04-25T18:00:00.000Z',
    endTime: '2026-04-25T20:00:00.000Z',
    capacity: 5,
    members: 5,
    createdAt: '2026-04-25T09:30:00.000Z',
  },
  {
    groupID: 3,
    title: 'ICS 311 Final Review Session',
    course: 'ICS 311',
    description: 'Will go over Dynamic Programming exercises and Single-Source Shortest Path (SSSP) problems.',
    location: 'Sustainability Courtyard',
    startTime: '2026-04-26T14:00:00.000Z',
    endTime: '2026-04-26T16:00:00.000Z',
    capacity: 8,
    members: 2,
    createdAt: '2026-04-25T08:15:00.000Z',
  },
];

  return (
    <main>
      <Container id="groups" fluid className="py-3">
        <Row>
          <Col>
            <StudyGroupClient groups={studyGroups} />
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default GroupsPage;