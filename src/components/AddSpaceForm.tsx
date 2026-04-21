'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddSpaceSchema, AddSpaceFormValues } from '@/lib/validationSchemas';
import { addListing } from '@/lib/dbActions';

const AddSpaceForm: React.FC = () => {
  const { status } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddSpaceFormValues>({
    resolver: yupResolver(AddSpaceSchema),
    defaultValues: {
      image: '',
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'unauthenticated') return null;

  const onSubmit: SubmitHandler<AddSpaceFormValues> = async (data) => {
    try {
      await addListing(data);

      swal('Success', 'Space added successfully', 'success', {
        timer: 2000,
      });

      reset();

      // no router.push needed (server redirect handles it)
    } catch (error) {
      console.error(error);
      swal('Error', 'Failed to add space', 'error');
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-3">Add Space</h2>

          <Card>
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

                {/* Occupancy */}
                <Form.Group className="mb-3">
                  <Form.Label>Occupancy</Form.Label>
                  <Form.Select {...register('occupancy')}>
                    <option value="Empty">Empty</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Crowded">Crowded</option>
                  </Form.Select>
                </Form.Group>

                {/* Noise Level */}
                <Form.Group className="mb-3">
                  <Form.Label>Noise Level</Form.Label>
                  <Form.Select {...register('noiseLevel')}>
                    <option value="Quiet">Quiet</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Loud">Loud</option>
                  </Form.Select>
                </Form.Group>

                {/* Food Allowed */}
                <Form.Group className="mb-3">
                  <Form.Label>Food Allowed</Form.Label>
                  <Form.Select {...register('foodAllowed')}>
                    <option value="Permitted">Permitted</option>
                    <option value="Prohibited">Prohibited</option>
                    <option value="Water">Water</option>
                  </Form.Select>
                </Form.Group>

                {/* Image */}
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="/images/room1.jpg"
                    {...register('image')}
                  />
                </Form.Group>

                {/* Buttons */}
                <Row>
                  <Col>
                    <Button type="submit" variant="success" className="w-100">
                      Add Space
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

export default AddSpaceForm;