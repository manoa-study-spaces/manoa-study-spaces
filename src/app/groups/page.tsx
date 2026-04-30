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

    const groups = await prisma.studyGroup.findMany({
    include: {
      members: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const studyGroups = groups.map((group) => ({
    groupID: group.groupID,
    title: group.title,
    course: group.course,
    description: group.description ?? '',
    location: group.location,
    startTime: group.startTime.toISOString(),
    endTime: group.endTime.toISOString(),
    capacity: group.capacity,
    members: group.members.length,
    createdAt: group.createdAt.toISOString(),
  }));

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