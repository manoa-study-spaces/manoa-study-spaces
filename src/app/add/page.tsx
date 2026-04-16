import { loggedInProtectedPage } from '@/lib/page-protection';
import AddStuffForm from '@/components/AddStuffForm';
import NavBar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
      <NavBar />
      <AddStuffForm />
      <Footer />
    </main>
  );
};

export default AddStuff;