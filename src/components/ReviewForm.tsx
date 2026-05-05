'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

type ReviewFormProps = {
  listingId: number;
};

export default function ReviewForm({ listingId }: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!session?.user?.email) {
    return <p className="text-muted">Please sign in to leave a review.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          rating: Number(rating),
          content,
        }),
      });

      if (response.ok) {
        setRating(5);
        setContent('');
        setMessage('Review posted successfully!');
        // Reload the page to show the new review
        setTimeout(() => window.location.reload(), 1500);
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.error || 'Failed to post review'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col lg={8}>
          <h3>Leave a Review</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value="5">★★★★★ Excellent</option>
                <option value="4">★★★★☆ Good</option>
                <option value="3">★★★☆☆ Average</option>
                <option value="2">★★☆☆☆ Poor</option>
                <option value="1">★☆☆☆☆ Very Poor</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Your Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Share your experience with this study space..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post Review'}
            </Button>
          </Form>

          {message && (
            <div className={`mt-3 alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
              {message}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
