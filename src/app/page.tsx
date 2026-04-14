import { Col, Container, Image, Row } from 'react-bootstrap';

/** The Home page. */
const Home = () => (
  <main>
    <Container id="home-page" fluid className="py-3">
      <Row className="align-middle text-center">
        <Col xs={4}>
          <Image src="next.svg" width="150px" alt="" />
        </Col>
        <Col xs={8} className="d-flex flex-column justify-content-center">
          <h1>Manoa Study Spaces</h1>
          <p>Sign In</p>
        </Col>
      </Row>
    </Container>
  </main>
);

export default Home;
