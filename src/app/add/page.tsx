import { loggedInProtectedPage } from '@/lib/page-protection';
import AddListingForm from '@/components/AddListingForm';
import { auth } from '@/lib/auth';

const AddStuff = async () => {
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  return (
    <main>
      <AddListingForm />
    </main>
  );
};

export default AddStuff;
