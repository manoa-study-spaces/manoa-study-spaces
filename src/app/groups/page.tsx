export const dynamic = 'force-dynamic';

import { Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import StudyGroupClient from '@/components/StudyGroupClient';

const GroupsPage = async () => {
  const session = await auth();

  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  const userId = session?.user?.id
    ? Number(session.user.id)
    : null;

  const groups = await prisma.studyGroup.findMany({
    include: {
      members: {
        include: {
          user: {
            include: {
              profile: {
                include: {
                  picture: true,
                },
              },
            },
          },
        },
      },
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

    isJoined: userId
      ? group.members.some((m) => m.userId === userId)
      : false,

    createdAt: group.createdAt.toISOString(),

      membersList: group.members.map((m) => ({
        id: m.user.id,
        name: m.user.name,
        image: m.user.image, 
      })),
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