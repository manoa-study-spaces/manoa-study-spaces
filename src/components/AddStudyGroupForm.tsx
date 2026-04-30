'use client';

import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const AddStudyGroupForm = () => {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [capacity, setCapacity] = useState(6);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      title,
      course,
      description,
      location,
      startTime,
      endTime,
      capacity,
    });

    alert('Create Study Group (connect Prisma next)');
  };

  return (
    <Form onSubmit={handleSubmit}>

      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Course</Form.Label>
        <Form.Control value={course} onChange={(e) => setCourse(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Location</Form.Label>
        <Form.Control value={location} onChange={(e) => setLocation(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Start Time</Form.Label>
        <Form.Control type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>End Time</Form.Label>
        <Form.Control type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Capacity</Form.Label>
        <Form.Control
          type="number"
          min={1}
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
        />
      </Form.Group>

      <Button type="submit" variant="success">
        Create Study Group
      </Button>

    </Form>
  );
};

export default AddStudyGroupForm;