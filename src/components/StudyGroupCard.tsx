'use client';

import { Card, Button } from 'react-bootstrap';
import { FaCalendar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoPeople } from "react-icons/io5";
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { joinStudyGroup, leaveStudyGroup } from '@/lib/dbActions';
// import Image from 'next/image';

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
  isJoined?: boolean;

  membersList?: {
    id: number;
    name: string;
    image?: string | null;
  }[];
};

type Props = {
  group: StudyGroup;
};

const TIMEZONE = 'Pacific/Honolulu';

const StudyGroupCard = ({ group }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isFull = group.members >= group.capacity;

  const isJoined = group.isJoined;

  const handleToggleJoin = async () => {
    if (!session?.user?.id) {
      alert('You must be logged in');
      return;
    }

    try {
      setLoading(true);

      if (isJoined) {
        await leaveStudyGroup({
          groupId: group.groupID,
          userId: Number(session.user.id),
        });

        alert('Left group');
      } else {
        await joinStudyGroup({
          groupId: group.groupID,
          userId: Number(session.user.id),
        });

        alert('Joined group');
      }
      router.refresh();

    } catch (err) {
      console.error(err);
      alert('Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="study-group-card mb-3">

      <Card.Body>

        {/* Title */}
        <Card.Title className="mb-1">
          {group.title}
        </Card.Title>

        {/* Course */}
        <div className="text-muted mb-2">
          {group.course}
        </div>

        {/* Description */}
        {group.description && (
          <div className="card-description">
            {group.description}
          </div>
        )}

        {/* Time */}
        <div className="info-row">
          <FaCalendar />

          <span>
            {new Date(group.startTime).toLocaleDateString('en-US', {
              timeZone: TIMEZONE,
              month: 'numeric',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>

          {' • '}

          <span>
            {new Date(group.startTime).toLocaleTimeString('en-US', {
              timeZone: TIMEZONE,
              hour: '2-digit',
              minute: '2-digit',
            })}

            {' – '}

            {new Date(group.endTime).toLocaleTimeString('en-US', {
              timeZone: TIMEZONE,
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* Location */}
        <div className="info-row">
          <FaLocationDot />
          {group.location}
        </div>

        {/* Members + Avatars */}
        <div className="info-row d-flex align-items-center gap-2">
          <IoPeople />
          {group.members} / {group.capacity}

          {/* Avatars are currently disabled */}
          {/* Reason: profileId: null && profile: null, can't figure out how to link profile image to this */}

          {/* Avatars
          {group.membersList?.slice(0, 4).map((m) => (
            <Image
              key={m.id}
              src={m.image || '/default-avatar.png'}
              alt={m.name}
              width={24}
              height={24}
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
                marginLeft: '-6px',
                border: '2px solid white',
              }}
            />
          ))} */}
        </div>

        {/* Button */}
        <Button
          variant={isJoined ? 'danger' : isFull ? 'secondary' : 'success'}
          disabled={(!isJoined && isFull) || loading}
          onClick={handleToggleJoin}
        >
          {isFull && !isJoined
            ? 'Full'
            : loading
            ? 'Processing...'
            : isJoined
            ? 'Leave Group'
            : 'Join Group'}
        </Button>

      </Card.Body>

    </Card>
  );
};

export default StudyGroupCard;