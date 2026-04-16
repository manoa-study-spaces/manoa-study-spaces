import { Col, Container, Image, Row } from 'react-bootstrap';

/** The Home page. */
const Home = () => (
  <main>
    <Container id="home-page" fluid className="py-3">
      <Row className="align-middle text-center">
        <Col xs={8} className="d-flex flex-column justify-content-center">
          <h1>Welcome to Manoa Study Spaces!</h1>
          <h2>~ your new home for studying with (or without) friends~</h2>
          <p>This website is designed exclusively for UH Manoa students to safely explore and utilize study spaces. 
            Sign up today to browse the latest listings and top recommendations from fellow students.
            Discover various locations around UH Manoa and all their ammenities to fit your needs!</p>
        </Col>
      </Row>
    </Container>
  </main>
);

export default Home;
