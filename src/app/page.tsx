'use client';

import { Container, Carousel, Image } from 'react-bootstrap';

/** The Home page */
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

        {/* Slide 3 */}
        <Carousel.Item>
          <Image
            className="d-block w-100"
            src="/hamilton-library.jpg"
            alt="Hamilton Library"
          />
          <Carousel.Caption>
            <h1>Discover Top Recommendations</h1>
            <p>See what other UH Mānoa students love most. Discover various location&apos;s ammenities to fit your needs </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </Container>
  </main>
);

export default Home;