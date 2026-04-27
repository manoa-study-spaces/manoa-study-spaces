// 'use client';

// import { Maybe } from 'yup';
// import { useSession } from 'next-auth/react'; // v5 compatible
// import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import swal from 'sweetalert';
// import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
// import { redirect, useRouter } from 'next/navigation';
// import { addListing } from '@/lib/dbActions';
// import LoadingSpinner from '@/components/LoadingSpinner';
// import { AddListingSchema } from '@/lib/validationSchemas';
// import { Amenity, FoodAllowed, Image, NoiseLevel, Occupancy, SpaceType, Times } from '@prisma/client';
// import { useState } from 'react';

// import ListingGallery from '@/components/ListingGallery';


// const onSubmit = async (data: {  
//   listingID: number;
//   buildingName: string; 
//   roomNumber: string; 
//   times: Times; 
//   pictures?: Maybe<FileList | undefined>;
//   occupancy: Occupancy; 
//   foodAllowed: FoodAllowed; 
//   noiseLevel: NoiseLevel; 
//   amenities: Amenity; 
//   spaceType: SpaceType; 
//   capacity: number;
// }, router: AppRouterInstance) => {
//   const newListing = await addListing ({
//     listingID: data.listingID,
//     buildingName: data.buildingName,
//     roomNumber: data.roomNumber,
//     occupancy: data.occupancy,
//     foodAllowed: data.foodAllowed,
//     noiseLevel: data.noiseLevel,
//     amenities: data.amenities,
//     spaceType: data.spaceType,
//     capacity: data.capacity,

//   });
//   const images = data.pictures;
//   const times = data.times;
//   if (images && images.length > 0) {
//     // Vercel rejects overly large payload/request,
//     // so upload images one by one instead of all together.
//     /* eslint-disable no-await-in-loop */
//     for (const image of images) {
//       const uploadData = new FormData();
//       uploadData.append('listingID', String(newListing.listingID));
//       uploadData.append('pictures', image);
//       const result = await fetch('/api/listing-images', {
//         method: 'POST',
//         body: uploadData,
//       });
//       if (!result.ok) {
//         throw new Error('Image upload failed');
//       }
//     }
//     /* eslint-enable no-await-in-loop */
//     const uploadData = new FormData();
//     uploadData.append('listingID', String(newListing.listingID));
//     uploadData.append('times', times ? JSON.stringify(times) : '');
//     const result = await fetch('/api/listing-images', {
//       method: 'POST',
//       body: uploadData,
//     });
//     if (!result.ok) {
//       throw new Error('Times upload failed');
//     }
//   }


//   swal('Success', 'Your listing has been added', 'success', {
//     timer: 2000,
//   }).then(() => {
//     router.push(`/listing-detail/${newListing.listingID}`);
//   });
// };

// const AddListingForm = ({ id } : { id : number }) => {
//   const router = useRouter();
//   const [previewImages, setPreviewImages] = useState<string[]>([]);
//   const { data: session, status } = useSession();
//   // console.log('AddListingForm', status, session);
//   const currentUser = session?.user?.email || '';
//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { files } = event.target;
//     if (!files || files.length === 0) {
//       setPreviewImages([]);
//       return;
//     }
//     const previews: string[] = [];
//     for (const file of files) {
//       const url = URL.createObjectURL(file); // temporary preview URL
//       previews.push(url);
//     }
//     setPreviewImages(previews);
//   };
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(AddListingSchema),
//   });
//   if (status === 'loading') {
//     return <LoadingSpinner />;
//   }
//   if (status === 'unauthenticated') {
//     redirect('/auth/signin');
//   }

//   return (
//     <Container className="py-3">
//       <Row className="justify-content-center g-4">
//         {/* LEFT COLUMN - image preview */}
//         <Col xs={12} md={6} className="d-flex justify-content-center">
//           <ListingGallery photograph={previewImages.map((url, index) => ({
//             id: index,
//             mimeType: '',
//             base64: '',
//             url,
//           }))}
//           />
//         </Col>
//         <Col xs={10}>
//           <Col className="text-center">
//             <h2>Add Listing</h2>
//           </Col>
//           <Card>
//             <Card.Body>
//               <Form onSubmit={handleSubmit((data) => onSubmit(data, router))}>
//                 <Row>
//                   <Col>
//                     <Form.Group>
//                       <Form.Label>Building Name</Form.Label>
//                       <input
//                         type="text"
//                         {...register('buildingName')}
//                         className={`form-control ${errors.buildingName ? 'is-invalid' : ''}`}
//                       />
//                       <div className="invalid-feedback">{errors.buildingName?.message}</div>
//                     </Form.Group>
//                   </Col>
//                   <Col>
//                     <Form.Group>
//                       <Form.Label>Room Number</Form.Label>
//                       <input
//                         type="text"
//                         {...register('roomNumber')}
//                         className={`form-control ${errors.roomNumber ? 'is-invalid' : ''}`}
//                       />
//                       <div className="invalid-feedback">{errors.roomNumber?.message}</div>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//                 <Row>
//                   <Col>
//                     <Form.Group>
//                       <Form.Label>Time</Form.Label>
//                       <input
//                         type="text"
//                         {...register('times')}
//                         className={`form-control ${errors.times ? 'is-invalid' : ''}`}
//                       />
//                       <div className="invalid-feedback">{errors.times?.message}</div>
//                     </Form.Group>
//                   </Col>
//                   <Col>
//                     <Form.Group>
//                       <Form.Label>Pictures</Form.Label>
//                       <input
//                         type="text"
//                         {...register('image')}
//                         className={`form-control ${errors.image ? 'is-invalid' : ''}`}
//                       />
//                       <div className="invalid-feedback">{errors.image?.message}</div>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//                 <Form.Group>
//                 <Row>
//                   <Col>
//                     <Form.Group>
//                       <Form.Label>Occupancy</Form.Label>
//                       <input
//                         type="text"
//                         {...register('occupancy')}
//                         className={`form-control ${errors.occupancy ? 'is-invalid' : ''}`}
//                       />
//                       <div className="invalid-feedback">{errors.occupancy?.message}</div>
//                     </Form.Group>
//                   </Col>
//                   <Col>
//                     <Form.Group>
//                       <Form.Label>Food Allowed</Form.Label>
//                       <input
//                         type="text"
//                         {...register('foodAllowed')}
//                         className={`form-control ${errors.foodAllowed ? 'is-invalid' : ''}`}
//                       />
//                       <div className="invalid-feedback">{errors.foodAllowed?.message}</div>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//                 <Row>
//                   <Col>
//                     <Form.Group>
//                       <Form.Label>Noise Level</Form.Label>
//                       <input
//                         type="text"
//                         {...register('noiseLevel')}
//                         className={`form-control ${errors.noiseLevel ? 'is-invalid' : ''}`}
//                       />
//                       <div className="invalid-feedback">{errors.noiseLevel?.message}</div>
//                     </Form.Group>
//                   </Col>
//                   <Col>
//                     <Form.Group>
//                       <Form.Label>Amenities</Form.Label>
//                       <input
//                         type="text"
//                         {...register('amenities')}
//                         className={`form-control ${errors.amenities ? 'is-invalid' : ''}`}
//                       />
//                       <div className="invalid-feedback">{errors.amenities?.message}</div>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//                 <Row>
//                   <Col>
//                     <Form.Group>
//                       <Form.Label>Space Type</Form.Label>
//                       <input
//                         type="text"
//                         {...register('spaceType')}
//                         className={`form-control ${errors.spaceType ? 'is-invalid' : ''}`}
//                       />
//                       <div className="invalid-feedback">{errors.spaceType?.message}</div>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//                 {/* Upload images */}
//                 <Form.Group className="mb-4">
//                   <Form.Label>
//                     Upload Images
//                     <span className="text-danger">*</span>
//                   </Form.Label>
//                   <input
//                     type="file"
//                     multiple
//                     accept="image/jpeg, image/png"
//                     {...register('image')}
//                     className={`form-control ${errors.image ? 'is-invalid' : ''}`}
//                     onChange={handleImageChange}
//                   />
//                   <div className="invalid-feedback">{errors.image?.message}</div>
//                   <Form.Text muted>
//                     Upload 1-9 photos. You can upload multiple photos at once. Square photos fits better.
//                     <br />
//                     Accepted formats: JPG (JPEG), PNG.
//                   </Form.Text>
//                 </Form.Group>
//                 </Form.Group>
//                 <input type="hidden" {...register('listingID')} value={id} />
//                 <Form.Group className="form-group">
//                   <Row className="pt-3">
//                     <Col>
//                       <Button type="submit" variant="primary">
//                         Submit
//                       </Button>
//                     </Col>
//                     <Col>
//                       <Button type="button" onClick={() => reset()} variant="warning" className="float-right">
//                         Reset
//                       </Button>
//                     </Col>
//                   </Row>
//                 </Form.Group>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default AddListingForm;
