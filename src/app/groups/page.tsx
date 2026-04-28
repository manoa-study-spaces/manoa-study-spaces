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
  // ✅ TODAY (now set to 2026-04-28 Hawaii-local test day)
  {
    groupID: 1,
    title: 'ICS 314 Final Project Work Session',
    course: 'ICS 314',
    description: 'Collaborating on final project and fixing database issues.',
    location: 'Hamilton Library - 3rd Floor',
    startTime: '2026-04-28T19:00:00.000Z', 
    endTime: '2026-04-28T21:00:00.000Z',
    capacity: 6,
    members: 3,
    createdAt: '2026-04-28T10:00:00.000Z',
  },

  // ❌ FULL GROUP (should hide when "open spots only" is on)
  {
    groupID: 2,
    title: 'ICS 212 Homework Help',
    course: 'ICS 212',
    description: 'Linked lists, pointers, and exam prep.',
    location: 'POST Building - Room 302',
    startTime: '2026-04-28T22:00:00.000Z',
    endTime: '2026-04-29T00:00:00.000Z',
    capacity: 5,
    members: 5, // FULL
    createdAt: '2026-04-28T09:30:00.000Z',
  },

  // 📅 TOMORROW (for week filter testing)
  {
    groupID: 3,
    title: 'ICS 311 Final Review Session',
    course: 'ICS 311',
    description: 'Dynamic Programming + SSSP review.',
    location: 'Sustainability Courtyard',
    startTime: '2026-04-29T20:00:00.000Z',
    endTime: '2026-04-29T22:00:00.000Z',
    capacity: 8,
    members: 2,
    createdAt: '2026-04-28T08:15:00.000Z',
  },

  // 📅 OUTSIDE WEEK RANGE (should disappear in "This Week")
  {
    groupID: 4,
    title: 'ICS 111 Early Prep Session',
    course: 'ICS 111',
    description: 'Intro programming fundamentals.',
    location: 'Webster Hall - Room 101',
    startTime: '2026-05-11T20:00:00.000Z',
    endTime: '2026-05-11T22:00:00.000Z',
    capacity: 10,
    members: 1,
    createdAt: '2026-04-28T08:00:00.000Z',
  },

  // 🔍 SEARCH TEST (keyword edge case)
  {
    groupID: 5,
    title: 'React Study Jam',
    course: 'Web Development',
    description: 'React hooks, state, and components practice.',
    location: 'Saunders Hall',
    startTime: '2026-04-28T23:00:00.000Z',
    endTime: '2026-04-29T01:00:00.000Z',
    capacity: 4,
    members: 2,
    createdAt: '2026-04-28T07:00:00.000Z',
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