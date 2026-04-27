'use client';

import { useMemo, useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { CiSearch } from 'react-icons/ci';
import { LiaTimesSolid } from 'react-icons/lia';
import StudyGroupCard from '@/components/StudyGroupCard';

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

const StudyGroupClient = ({ groups }: StudyGroupClientProps) => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<TabType>('all');
  const [openOnly, setOpenOnly] = useState(false);

  const now = useMemo(() => new Date(), []);  // Creates a fixed “current time” value.

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
        const start = new Date(group.startTime);

        if (tab === 'today') {
          return start.toDateString() === now.toDateString();
        }

        if (tab === 'week') {
          const weekLater = new Date();
          weekLater.setDate(now.getDate() + 7);

          return start >= now && start <= weekLater;
        }

        if (tab === 'mine') {
          return true;
        }
        return true;
      });
  }, [groups, search, openOnly, tab, now]);

  return (
    <Container fluid>

      {/* Tabs */}
        <div className="mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">

        {/* Left side: Tabs */}
        <div className="d-flex align-items-center gap-2 flex-wrap">

          <Button className="group-tab-btn" variant={tab === 'all' ? 'dark' : 'outline-dark'}
            onClick={() => setTab('all')}
            > All
          </Button>

          <Button className="group-tab-btn" variant={tab === 'today' ? 'dark' : 'outline-dark'}
            onClick={() => setTab('today')}
            > Today
          </Button>

          <Button className="group-tab-btn" variant={tab === 'week' ? 'dark' : 'outline-dark'}
            onClick={() => setTab('week')}
            > This Week
          </Button>

          <Button className="group-tab-btn" variant={tab === 'mine' ? 'dark' : 'outline-dark'}
            onClick={() => setTab('mine')}
            > My Groups
          </Button>
        </div>
    </div>

    {/* Search + Filters */}
    <div className="mb-3 d-flex align-items-center gap-2 flex-nowrap">

        {/* Search Bar */}
        <div style={{ flex: '0 1 49%', minWidth: 0 }}>
        <InputGroup style={{ width: '100%' }}>
            
            <InputGroup.Text>
            <CiSearch />
            </InputGroup.Text>

            <Form.Control className="group-search" type="text" placeholder="Search by group name or course..." value={search}
            onChange={(event) => setSearch(event.target.value)}
            />

            {search && (
            <Button variant="outline-secondary"
                onClick={() => setSearch('')}>
                <LiaTimesSolid />
            </Button>
            )}
            </InputGroup>
        </div>

        {/* Create Group Button */}
        <Button className="create-group-btn flex-shrink-0">
            + Create Group
        </Button>

        {/* Toggle */}
        <div className="group-toggle ms-auto">
        <Form.Check type="switch" label="Open spots only" checked={openOnly}
            onChange={(e) => setOpenOnly(e.target.checked)}/>
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