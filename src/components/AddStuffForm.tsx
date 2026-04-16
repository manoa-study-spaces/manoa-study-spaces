'use client';

import { useSession } from 'next-auth/react'; // v5 compatible
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { addStuff } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddStuffSchema } from '@/lib/validationSchemas';

const onSubmit = async (data: { name: string; quantity: number; owner: string; condition: string }) => {
  // console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
  await addStuff(data);
  swal('Success', 'Your item has been added', 'success', {
    timer: 2000,
  });
};

const AddStuffForm: React.FC = () => {
  const { data: session, status } = useSession();
  // console.log('AddStuffForm', status, session);
  const currentUser = session?.user?.email || '';
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddStuffSchema),
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
        <Col xs={5}>
          <Col className="text-center">
            <h2>Add Space</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>

                  <Form.Label>Building Name</Form.Label>
                  <input
                    type="text"
                    {...register('buildingName')}
                    className={`form-control ${errors.buildingName ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.buildingName?.message}</div>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Room Number [N/A if none]</Form.Label>
                  <input
                    type="string"
                    {...register('roomNumber')}
                    className={`form-control ${errors.roomNumber ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.roomNumber?.message}</div>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Times</Form.Label>
                  <input
                    type="times[]"
                    {...register('times')}
                    className={`form-control ${errors.times ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.times?.message}</div>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Pictures</Form.Label>
                  <input
                    type="image[]"
                    {...register('pictures')}
                    className={`form-control ${errors.pictures ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.pictures?.message}</div>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Occupancy</Form.Label>
                  <select {...register('occupancy')} className={`form-control ${errors.occupancy ? 'is-invalid' : ''}`}>
                    <option value="empty">Empty</option>
                    <option value="moderate">Moderate</option>
                    <option value="crowded">Crowded</option>
                  </select>
                  <div className="invalid-feedback">{errors.occupancy?.message}</div>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Food Allowed</Form.Label>
                  <select {...register('foodAllowed')} className={`form-control ${errors.foodAllowed ? 'is-invalid' : ''}`}>
                    <option value="permitted">Permitted</option>
                    <option value="prohibited">Prohibited</option>
                    <option value="water okay">Water Okay</option>
                  </select>
                  <div className="invalid-feedback">{errors.foodAllowed?.message}</div>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Noise Level</Form.Label>
                  <select {...register('noiseLevel')} className={`form-control ${errors.noiseLevel ? 'is-invalid' : ''}`}>
                    <option value="quiet">Quiet</option>
                    <option value="moderate">Moderate</option>
                    <option value="loud">Loud</option>
                  </select>
                  <div className="invalid-feedback">{errors.noiseLevel?.message}</div>
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

export default AddStuffForm;
