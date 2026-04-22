'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddSpaceSchema } from '@/lib/validationSchemas';
import { addListing } from '@/lib/dbActions';

const onSubmit = async (data: {
  buildingName: string;
  roomNumber: string;
  occupancy: 'Empty' | 'Moderate' | 'Crowded';
  foodAllowed: 'Permitted' | 'Prohibited' | 'Water';
  noiseLevel: 'Quiet' | 'Moderate' | 'Loud';
  spaceType: 'Indoor' | 'Outdoor';
  capacity: number;
  image?: string | null;
}) => {
  await addListing({
    ...data,
    image: data.image ?? undefined, 
  });

  swal('Success', 'Space added successfully', 'success', {
    timer: 2000,
  });
};

const AddSpaceForm: React.FC = () => {
  const { status } = useSession();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddSpaceSchema),
  });

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={12} lg={10}>
          <Card className="add-space-card">
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                {/* Building Name */}
                <Form.Group className="mb-3">
                  <Form.Label>Building Name</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('buildingName')}
                    isInvalid={!!errors.buildingName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.buildingName?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Room Number */}
                <Form.Group className="mb-3">
                  <Form.Label>Room Number</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('roomNumber')}
                    isInvalid={!!errors.roomNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.roomNumber?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row className="g-3">
                  {/* Left Column */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Occupancy</Form.Label>
                      <Form.Select {...register('occupancy')}>
                        <option value="Empty">Empty</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Crowded">Crowded</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mt-3">
                      <Form.Label>Noise Level</Form.Label>
                      <Form.Select {...register('noiseLevel')}>
                        <option value="Quiet">Quiet</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Loud">Loud</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Right Column */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Space Type</Form.Label>
                      <Form.Select {...register('spaceType')}>
                        <option value="Indoor">Indoor</option>
                        <option value="Outdoor">Outdoor</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mt-3">
                      <Form.Label>Capacity</Form.Label>
                      <Form.Control
                        type="number"
                        min={1}
                        {...register('capacity')}
                        isInvalid={!!errors.capacity}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.capacity?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Image Row */}
                <Row className="mt-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Image URL</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        {...register('image')}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Buttons */}
                <Row className="mt-4">
                  <Col>
                    <Button type="submit" variant="success" className="w-100">
                      Add Space
                    </Button>
                  </Col>
                  <Col>
                    <Button type="button" variant="secondary" className="w-100" onClick={() => reset()}>
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

export default AddSpaceForm;