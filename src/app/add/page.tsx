import { loggedInProtectedPage } from '@/lib/page-protection';
import AddSpaceForm from '@/components/AddSpaceForm';
import { auth } from '@/lib/auth';
import { Container } from 'react-bootstrap';

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
        <AddSpaceForm  />
      </Container>
    </main>
  );
};

export default AddStuff;