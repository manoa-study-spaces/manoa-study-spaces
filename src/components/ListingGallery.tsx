'use client';

import { listingImage, DEFAULT_IMAGE, parseImageSource } from '@/lib/listingImage';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

const ListingGallery = ({ photograph }: { photograph : listingImage[] }) => {
  if (photograph.length === 0) {
    photograph.push(DEFAULT_IMAGE);
  }

const [selectedPhotograph, setSelectedPhotograph] = useState(photograph[0]);

  useEffect(() => {
    setSelectedPhotograph(photograph[0]);
  }, [photograph]);

  return (
    <Container fluid>
      <Container className="ms-0 ratio ratio-1x1" fluid style={{ maxWidth: '600px' }}>
        <Image
          src={parseImageSource(selectedPhotograph)}
          alt=""
          className="object-fit-cover rounded-2"
        />
      </Container>
      <Container className="pt-2" fluid>
        <Row>
          {photograph.map((photographData) => (
            <Col className="ratio ratio-1x1 px-0" key={photographData.id} style={{ maxWidth: '120px' }}>
              <Image
                key={photographData.id}
                src={parseImageSource(photographData)}
                alt=""
                className={
                  `object-fit-cover
                  rounded-2
                  ${photographData.id === selectedPhotograph.id ? 'border border-4 border-wonkes-3' : ''}`
                }
                onClick={() => setSelectedPhotograph(photographData)}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default ListingGallery;
