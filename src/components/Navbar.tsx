'use client';

import { useSession } from 'next-auth/react'; // v5 compatible
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, Lock, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
import Image from 'next/image';

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const pathName = usePathname();
  if (status === 'loading') return null;
  const currentUser = session?.user?.email;
  const role = session?.user?.role;

  /*const titles: Record<string, string> = {
    '/today': "Today's Spaces",
    '/list': 'Study Spaces',
    '/groups': 'Study Groups',
    '/admin': 'Admin Panel',
    '/profile': 'Profile',
    '/add': 'Add Spaces',
  };*/

  // Single combined navbar: logo + page title on the left, links + profile on the right
  return (
    <Navbar className="bottom-navbar px-3" expand="lg">
      <Container fluid className="d-flex align-items-center">
        {/* Logo */}
        <Navbar.Brand href="/" className="d-flex align-items-center me-3">
          <Image src="/StudySpacesLogo.png" alt="Logo" width={120} height={80} />
        </Navbar.Brand>

        {/* left area (logo only) */}

        <div className="ms-auto d-flex align-items-center gap-2">
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="hamburger-toggle" />
        </div>

        <Navbar.Collapse id="basic-navbar-nav">
          {currentUser && (
            <Nav className="me-auto">
              <Nav.Link href="/today" active={pathName === '/today'}>
                Today&apos;s Spaces
              </Nav.Link>
              <Nav.Link href="/list" active={pathName === '/list'}>
                Study Spaces
              </Nav.Link>
              <Nav.Link href="/groups" active={pathName === '/groups'}>
                Study Groups
              </Nav.Link>
            </Nav>
          )}
          <Nav className="ms-auto">
            {currentUser && (
              <>
                <Nav.Link
                  href={session ? '/profile' : '/auth/signin'}
                  active={pathName === '/profile' || pathName === '/auth/signin'}
                  className="profile-link d-flex align-items-center"
                >
                  <PersonFill size={22} color="#3e7969" />
                </Nav.Link>
              </>
            )}
            {currentUser && role === 'ADMIN' && (
              <Nav.Link href="/admin" active={pathName === '/admin'}>
                Admin
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {session ? (
              <NavDropdown id="login-dropdown" title={currentUser}>
                <NavDropdown.Item id="login-dropdown-sign-out" href="/api/auth/signout">
                  <BoxArrowRight />
                  Sign Out
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password">
                  <Lock />
                  Change Password
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="login-dropdown" title="Login">
                <NavDropdown.Item id="login-dropdown-sign-in" href="/auth/signin">
                  <PersonFill />
                  Sign in
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-up" href="/auth/signup">
                  <PersonPlusFill />
                  Sign up
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

};

export default NavBar;
