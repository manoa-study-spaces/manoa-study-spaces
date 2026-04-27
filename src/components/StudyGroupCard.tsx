'use client';

import { Card, Button } from 'react-bootstrap';
import { FaCalendar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoPeople } from "react-icons/io5";

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
};

type Props = {
  group: StudyGroup;
};

const StudyGroupCard = ({ group }: Props) => {
  const isFull = group.members >= group.capacity;

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
            {new Date(group.startTime).toLocaleString([], {
            month: 'numeric', day: 'numeric', year: 'numeric',
            })}
        </span>
        {' • '}
        <span>
            {new Date(group.startTime).toLocaleTimeString([], {
            hour: '2-digit', minute: '2-digit',
            })}
            {' – '}
            {new Date(group.endTime).toLocaleTimeString([], {
            hour: '2-digit', minute: '2-digit',
            })}
        </span>
        </div>
        
        {/* Location */}
        <div className="info-row">
          <FaLocationDot />
          {group.location}
        </div>

        {/* Members */}
        <div className="info-row">
          <IoPeople />
          {group.members} / {group.capacity}
        </div>

        {/* Action Button */}
        <Button
          variant={isFull ? 'secondary' : 'success'}
          disabled={isFull}
        >
          {isFull ? 'Full' : 'Join Group'}
        </Button>

      </Card.Body>

    </Card>
  );
};

export default StudyGroupCard;