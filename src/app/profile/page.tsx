export const dynamic = 'force-dynamic';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import ProfileClient from '@/components/ProfileClient';

const ProfilePage = async () => {
  const session = await auth();

  loggedInProtectedPage(session as { user: { email: string; id: string; name: string } } | null);

  const userId = session?.user?.id ? Number(session.user.id) : null;
  const email = session?.user?.email ?? '';

  let profile = null;
  if (userId) {
    profile = await prisma.profile.findUnique({
      where: { profileID: userId },
      include: { picture: true },
    });
  }

  // Normalize profile for serialization and pass to client
  const serialized = profile
    ? {
        fullName: profile.fullName || '',
        major: profile.major || '',
        standing: profile.standing || null,
        interests: profile.Interests || '',
        classes: profile.classes || '',
        status: profile.status || '',
        picture: profile.picture && profile.picture.length ? profile.picture.map((p) => ({ fileName: p.fileName })) : [],
      }
    : null;

  return (
    <main>
      <ProfileClient profile={serialized} email={email} />
    </main>
  );
};

export default ProfilePage;
