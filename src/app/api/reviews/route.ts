import { auth } from '@/lib/auth';
import { createReview } from '@/lib/dbActions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { listingId, rating, content } = body;

    if (!listingId || !rating || !content) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);

    if (Number.isNaN(userId)) {
      return Response.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    await createReview({
      listingId,
      authorId: userId,
      rating: Number(rating),
      content,
    });

    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
