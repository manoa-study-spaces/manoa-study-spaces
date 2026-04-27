import { Col, Container, Row } from 'react-bootstrap';

/** The Home page. */
const Home = () => (
  <main>
    <Container fluid className="p-0">
      <Carousel className="hero-carousel" indicators controls interval={7000}>

        {/* Slide 1 */}
        <Carousel.Item>
          <Image
            className="d-block w-100"
            src="/manoa-lowercampus-hero.jpg"
            alt="UH Mānoa Lower Campus"
          />
          <Carousel.Caption>
            <h1>Welcome to Manoa Study Spaces</h1>
            <p>Discover quiet zones, group spaces, and student favorites across campus.</p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 2 */}
        <Carousel.Item>
          <Image
            className="d-block w-100"
            src="/paradise-palms.jpg"
            alt="Paradise Palms"
          />
          <Carousel.Caption>
            <h1>Share Your Study Space</h1>
            <p>Know a great spot on campus? Help other UH Mānoa students discover it by sharing your favorite study spaces.</p>
          </Carousel.Caption>
        </Carousel.Item>

          <p style={{ color: '#3e7969' }}>This website is designed exclusively for UH Manoa students to safely explore and utilize study spaces. 
            Sign up today to browse the latest listings and top recommendations from fellow students.
            Discover various locations around UH Manoa and all their ammenities to fit your needs!</p>
        </Col>
      </Row>
    </Container>
  </main>
);

export default Home;
