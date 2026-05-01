'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { createStudyGroup } from '@/lib/dbActions';
import { useRouter } from 'next/navigation';

type StudyGroupFormData = {
  title: string;
  course: string;
  description?: string;
  location: string;
  startTime: string;
  endTime: string;
  capacity: number;
};

const AddStudyGroupForm: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudyGroupFormData>();

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  const onSubmit = async (data: StudyGroupFormData) => {
    try {
      if (!session?.user?.email) {
        alert('You must be logged in to create a study group');
        return;
      }

      await createStudyGroup({
        title: data.title,
        course: data.course,
        description: data.description,
        location: data.location,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        capacity: Number(data.capacity),
        organizerId: Number(session.user.id),
      });

      swal('Success', 'Study group created successfully', 'success', {
        timer: 2000,
      });

      reset();

      router.push('/groups');
    } catch (err) {
      console.error(err);
      swal('Error', 'Failed to create study group', 'error');
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={12} lg={10}>
          <Card className="add-study-group-card">
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>

                {/* Title */}
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('title', { required: true })}
                    isInvalid={!!errors.title}
                  />
                </Form.Group>

                {/* Course */}
                <Form.Group className="mb-3">
                  <Form.Label>Course</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('course', { required: true })}
                    isInvalid={!!errors.course}
                  />
                </Form.Group>

                {/* Description */}
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    {...register('description')}
                  />
                </Form.Group>

                {/* Location */}
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('location', { required: true })}
                  />
                </Form.Group>

                <Row className="g-3">

                  {/* Start Time */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Start Time</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        {...register('startTime', { required: true })}
                      />
                    </Form.Group>
                  </Col>

                  {/* End Time */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>End Time</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        {...register('endTime', { required: true })}
                      />
                    </Form.Group>
                  </Col>

                </Row>

                {/* Capacity */}
                <Form.Group className="mb-3 mt-3">
                  <Form.Label>Capacity</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    defaultValue={6}
                    {...register('capacity')}
                  />
                </Form.Group>

                {/* Buttons */}
                <Row className="mt-4">
                  <Col>
                    <Button type="submit" variant="success" className="w-100">
                      Create Study Group
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-100"
                      onClick={() => reset()}
                    >
                      Reset
                    </Button>
                  </Col>
                </Row>

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddStudyGroupForm;