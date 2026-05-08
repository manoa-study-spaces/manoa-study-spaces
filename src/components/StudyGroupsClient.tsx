"use client";

import { useEffect, useState } from 'react';
import StudyGroupCard, { StudyGroup } from '@/components/StudyGroupCard';
import { Container, Row, Col } from 'react-bootstrap';

export default function StudyGroupsClient() {
  // emailKey intentionally not required here; preserved for parity with other clients
  const [ids, setIds] = useState<number[]>([]);
  const [groups, setGroups] = useState<StudyGroup[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const keys = Object.keys(window.localStorage).filter((k) => k.startsWith('profile:'));
    for (const k of keys) {
      try {
        const raw = window.localStorage.getItem(k) || '{}';
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const joined = (parsed.joinedStudyGroups as number[] | undefined) ?? [];
        if (joined.length > 0) {
          Promise.resolve().then(() => {
            setIds(joined);
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
        const joined = (parsed.joinedStudyGroups as number[] | undefined) ?? [];
        if (joined.length > 0) {
          Promise.resolve().then(() => {
            setIds(joined);
          });
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!ids || ids.length === 0) return;
    const qs = ids.join(',');
    fetch(`/api/studygroups?ids=${qs}`).then((res) => res.json()).then((data) => {
      const rawGroups = (data.groups || []) as StudyGroup[];
      const gs = rawGroups.map((g) => ({ ...g, isJoined: true } as StudyGroup));
      setGroups(gs);
    }).catch(() => {});
  }, [ids]);

  if (!ids || ids.length === 0) {
    return <p className="muted">No joined study groups</p>;
  }

  return (
    <Container fluid>
      <Row xs={1} md={2} className="g-3">
        {groups.map((g) => (
          <Col key={g.groupID}>
            <StudyGroupCard group={g} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
