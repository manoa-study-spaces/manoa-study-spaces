import { loggedInProtectedPage } from '@/lib/page-protection';
import AddListingForm from '@/components/AddListingForm';
import { auth } from '@/lib/auth';
import { Container } from 'react-bootstrap';
import { randomInt } from 'crypto';

const AddStuff = async () => {
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  return (
    <main className="flex-grow-1 bg-wonkes-7">
      <Container>
        <AddListingForm id={randomInt(1, 200)} />
      </Container>
    </main>
  );
};

export default AddStuff;