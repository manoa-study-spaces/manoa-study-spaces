import { Container } from 'react-bootstrap';
import { auth } from '@/lib/auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import AddStudyGroupForm from '@/components/AddStudyGroupForm';

const AddStudyGroup = async () => {
  const session = await auth();

  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  return (
    <main className="flex-grow-1 bg-wonkes-7">
      <Container>
        <AddStudyGroupForm />
      </Container>
    </main>
  );
};

export default AddStudyGroup;