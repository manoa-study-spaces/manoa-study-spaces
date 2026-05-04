'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddSpaceSchema } from '@/lib/validationSchemas';
import { addListing } from '@/lib/dbActions';
import type { Amenity } from '@prisma/client';

/**
 * List of available amenities (must match Prisma enum values exactly)
 */
const AMENITIES: Amenity[] = [
  'Outlets',
  'AirConditioning',
  'WiFi',
  'Printing',
  'Whiteboards',
  'ReservableRooms',
  'Accessible',
  'WaterRefill',
];

// Map enum names to display names
const amenityDisplayNames: Record<string, string> = {
  Outlets: 'Outlets',
  AirConditioning: 'Air Conditioning',
  WiFi: 'WiFi',
  Printing: 'Printing',
  Whiteboards: 'Whiteboards',
  ReservableRooms: 'Reservation Req.',
  Accessible: 'Accessibility',
  WaterRefill: 'Water Refill',
};

/**
 * Strongly typed form values
 */
type AddSpaceFormValues = {
  buildingName: string;
  roomNumber: string;
  occupancy: 'Empty' | 'Moderate' | 'Crowded';
  foodAllowed: 'Permitted' | 'Prohibited' | 'Water';
  noiseLevel: 'Quiet' | 'Moderate' | 'Loud';
  spaceType: 'Indoor' | 'Outdoor';
  capacity: number;
  image?: string;
  amenities: string[]; // checkbox output stays string[]
};

/**
 * onSubmit = async function to handle form submission.
 * Takes validated form data and sends it to the database.
 */
const onSubmit = async (data: AddSpaceFormValues) => {
  /**
   * FIX: convert string[] → Amenity[]
   * This is the ONLY safe place to do conversion (boundary layer)
   */
  const cleanedAmenities: Amenity[] = data.amenities
    .filter((a): a is Amenity => AMENITIES.includes(a as Amenity));

  await addListing({
    ...data,
    amenities: cleanedAmenities,
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
  } = useForm<AddSpaceFormValues>({
    resolver: yupResolver(AddSpaceSchema) as Resolver<AddSpaceFormValues>,
    defaultValues: {
      amenities: [],
    },
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
              <Form
                onSubmit={handleSubmit(
                  (data) => {
                    console.log('✅ Valid Submit', data);
                    onSubmit(data);
                  },
                  (errors) => {
                    console.log('❌ Invalid Submit:', errors);
                  }
                )}
              >

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
                      <Form.Label>Food Allowed</Form.Label>
                      <Form.Select {...register('foodAllowed')}>
                        <option value="">Select one</option>
                        <option value="Permitted">Permitted</option>
                        <option value="Prohibited">Prohibited</option>
                        <option value="Water">Water</option>
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
                        {...register('capacity', { valueAsNumber: true })}
                        isInvalid={!!errors.capacity}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.capacity?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Image */}
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

                {/* Amenities */}
                <Row className="mt-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Amenities</Form.Label>

                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '12px 24px',
                        }}
                      >
                        {AMENITIES.map((amenity) => (
                          <Form.Check
                            key={amenity}
                            type="checkbox"
                            label={amenityDisplayNames[amenity] || amenity}
                            value={amenity}
                            {...register('amenities')}
                            style={{
                              minWidth: '160px',
                            }}
                          />
                        ))}
                      </div>
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