'use client';

import { useMemo, useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { CiSearch } from 'react-icons/ci';
import { LiaTimesSolid } from 'react-icons/lia';
import StudyGroupCard from '@/components/StudyGroupCard';
import { useRouter } from 'next/navigation';

type StudyGroup = {
  groupID: number;
  title: string;
  course: string;
  description?: string;
  location: string;
  startTime: string;
  endTime: string;
  capacity: number;
  members: number;
  createdAt: string;
};

type StudyGroupClientProps = {
  groups: StudyGroup[];
};

type TabType = 'all' | 'today' | 'week' | 'mine';

const TIMEZONE = 'Pacific/Honolulu';

// Convert any date into Hawaii-local date object
const toHawaiiDate = (date: Date | string) =>
  new Date(
    new Date(date).toLocaleString('en-US', { timeZone: TIMEZONE })
  );

const StudyGroupClient = ({ groups }: StudyGroupClientProps) => {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<TabType>('all');
  const [openOnly, setOpenOnly] = useState(false);

  const now = useMemo(() => toHawaiiDate(new Date()), []);

  const filteredGroups = useMemo(() => {
    return groups
      .filter((group) => {
        const matchesSearch =
          group.title.toLowerCase().includes(search.toLowerCase()) ||
          group.course.toLowerCase().includes(search.toLowerCase());

        const hasSpots = group.members < group.capacity;

        return matchesSearch && (!openOnly || hasSpots);
      })
      .filter((group) => {
        const start = toHawaiiDate(group.startTime);

        if (tab === 'today') {
          const startDay = new Date(start);
          startDay.setHours(0, 0, 0, 0);

          const nowDay = new Date(now);
          nowDay.setHours(0, 0, 0, 0);

          return startDay.getTime() === nowDay.getTime();
        }

        if (tab === 'week') {
          const startOfToday = new Date(now);
          startOfToday.setHours(0, 0, 0, 0);

          const weekLater = new Date(startOfToday);
          weekLater.setDate(startOfToday.getDate() + 7);

          return start >= startOfToday && start < weekLater;
        }

        return true;
      });
  }, [groups, search, openOnly, tab, now]);

  return (
    <Container fluid>

      {/* Tabs */}
      <div className="mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">

        <div className="d-flex align-items-center gap-2 flex-wrap">

          <Button
            className="group-tab-btn"
            variant={tab === 'all' ? 'dark' : 'outline-dark'}
            onClick={() => setTab('all')}
          >
            All
          </Button>

          <Button
            className="group-tab-btn"
            variant={tab === 'today' ? 'dark' : 'outline-dark'}
            onClick={() => setTab('today')}
          >
            Today
          </Button>

          <Button
            className="group-tab-btn"
            variant={tab === 'week' ? 'dark' : 'outline-dark'}
            onClick={() => setTab('week')}
          >
            This Week
          </Button>

          <Button
            className="group-tab-btn"
            variant={tab === 'mine' ? 'dark' : 'outline-dark'}
            onClick={() => setTab('mine')}
          >
            My Groups
          </Button>

        </div>
      </div>

      {/* Search + Filters */}
      <div className="mb-3 d-flex align-items-center gap-2 flex-nowrap">

        {/* Search Bar */}
        <div style={{ flex: '0 1 49%', minWidth: 0 }}>
          <InputGroup>

            <InputGroup.Text>
              <CiSearch />
            </InputGroup.Text>

            <Form.Control
              className="group-search"
              type="text"
              placeholder="Search by group name or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <Button variant="outline-secondary" onClick={() => setSearch('')}>
                <LiaTimesSolid />
              </Button>
            )}

          </InputGroup>
        </div>

        {/* Create Group Button (FIXED → navigation instead of modal) */}
        <Button
          className="create-group-btn flex-shrink-0"
          onClick={() => router.push('/addstudygroup')}
        >
          + Create Group
        </Button>

        {/* Toggle */}
        <div className="group-toggle ms-auto">
          <Form.Check
            type="switch"
            label="Open spots only"
            checked={openOnly}
            onChange={(e) => setOpenOnly(e.target.checked)}
          />
        </div>

      </div>

      {/* Results */}
      <Row xs={1} md={2} className="g-3">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <Col key={group.groupID}>
              <StudyGroupCard group={group} />
            </Col>
          ))
        ) : (
          <div className="text-center text-muted mt-4">
            No study groups found.
          </div>
        )}
      </Row>

    </Container>
  );
};

export default StudyGroupClient;