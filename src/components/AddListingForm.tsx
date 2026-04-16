'use client';

import { useSession } from 'next-auth/react'; // v5 compatible
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { addListing } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddListingSchema } from '@/lib/validationSchemas';

const onSubmit = async (data: {  
  buildingName: string; 
  roomNumber: string; 
  times?: number[]; 
  pictures?: number[];
  occupancy: string; 
  foodAllowed: string; 
  noiseLevel: string; 
  amenities: string; 
  spaceType: string; 
  capacity: number
}) => {
  // console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
  await addListing(data);
  swal('Success', 'Your listing has been added', 'success', {
    timer: 2000,
  });
};

const AddLListingForm: React.FC = () => {
  const { data: session, status } = useSession();
  // console.log('AddListingForm', status, session);
  const currentUser = session?.user?.email || '';
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddListingSchema),
  });
  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={10}>
          <Col className="text-center">
            <h2>Add Listing</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Building Name</Form.Label>
                      <input
                        type="text"
                        {...register('buildingName')}
                        className={`form-control ${errors.buildingName ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.buildingName?.message}</div>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Room Number</Form.Label>
                      <input
                        type="text"
                        {...register('roomNumber')}
                        className={`form-control ${errors.roomNumber ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.roomNumber?.message}</div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Time</Form.Label>
                      <input
                        type="text"
                        {...register('time')}
                        className={`form-control ${errors.time ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.time?.message}</div>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Pictures</Form.Label>
                      <input
                        type="text"
                        {...register('pictures')}
                        className={`form-control ${errors.pictures ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.pictures?.message}</div>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Occupancy</Form.Label>
                      <input
                        type="text"
                        {...register('occupancy')}
                        className={`form-control ${errors.occupancy ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.occupancy?.message}</div>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Food Allowed</Form.Label>
                      <input
                        type="text"
                        {...register('foodAllowed')}
                        className={`form-control ${errors.foodAllowed ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.foodAllowed?.message}</div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Noise Level</Form.Label>
                      <input
                        type="text"
                        {...register('noiseLevel')}
                        className={`form-control ${errors.noiseLevel ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.noiseLevel?.message}</div>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Amenities</Form.Label>
                      <input
                        type="text"
                        {...register('amenities')}
                        className={`form-control ${errors.amenities ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.amenities?.message}</div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Space Type</Form.Label>
                      <input
                        type="text"
                        {...register('spaceType')}
                        className={`form-control ${errors.spaceType ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.spaceType?.message}</div>
                    </Form.Group>
                  </Col>
                </Row>
                  <Form.Label>Condition</Form.Label>
                  <select {...register('condition')} className={`form-control ${errors.condition ? 'is-invalid' : ''}`}>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                  <div className="invalid-feedback">{errors.condition?.message}</div>
                </Form.Group>
                <input type="hidden" {...register('owner')} value={currentUser} />
                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Col>
                    <Col>
                      <Button type="button" onClick={() => reset()} variant="warning" className="float-right">
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddListingForm;
