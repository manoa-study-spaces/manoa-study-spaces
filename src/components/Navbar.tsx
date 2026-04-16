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

  const titles: Record<string, string> = {
    '/today': "Today's Spaces",
    '/list': "Study Spaces",
    '/groups': "Study Groups",
    '/admin': "Admin Panel",
    '/profile': "Profile",
  };
  const title = titles[pathName] || "Manoa Study Spaces";
  
  return (
    <>
    {/* ---------------- Top Navbar ---------------- */}
      <Navbar className="top-navbar" expand="lg">
        <Container fluid className="d-flex justify-content-between align-items-center">
          {/* Left Logo */}
          <Navbar.Brand href="/">
            <Image
              src="/StudySpacesLogo.png"
              alt="Logo"
              width={90}
              height={60}
            />
          </Navbar.Brand>

          {/* Right Text */}
          <div className="navbar-top-text">
            {title}
          </div>
        </Container>
      </Navbar>

    {/* ---------------- Bottom Navbar ---------------- */}
      <Navbar className="bottom-navbar px-3" expand="lg">
        <div className="d-flex align-items-center w-100">

          {/* Left Text */}
          <div className="navbar-bottom-text">
            UHM, let&apos;s study!
          </div>

          <div className="ms-auto d-flex align-items-center gap-1">
            {/* Profile Icon */}
            <Nav>
              <Nav.Link href="/profile" active={pathName === '/profile'}>
                <PersonFill size={22} color="#3e7969" />
              </Nav.Link>
            </Nav>

            {/* Hamburger */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="hamburger-toggle"/>
          </div>
        </div>

        {/* Collapsible Section */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {currentUser && (
              <>
                <Nav.Link href="/today" active={pathName === '/today'}>
                  Today&apos;s Spaces
                </Nav.Link>
                <Nav.Link href="/list" active={pathName === '/list'}>
                  Study Spaces
                </Nav.Link>
                <Nav.Link href="/groups" active={pathName === '/groups'}>
                  Study Groups
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
      </Navbar>
    </>
  );
};

export default NavBar;

// Profile Stuff
            // <Nav>
            //   {session ? (
            //     <NavDropdown id="login-dropdown" title={currentUser}>
            //       <NavDropdown.Item id="login-dropdown-sign-out" href="/api/auth/signout">
            //         <BoxArrowRight />
            //         Sign Out
            //       </NavDropdown.Item>
            //       <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password">
            //         <Lock />
            //         Change Password
            //       </NavDropdown.Item>
            //     </NavDropdown>
            //   ) : (
            //     <NavDropdown id="login-dropdown" title="Login">
            //       <NavDropdown.Item id="login-dropdown-sign-in" href="/auth/signin">
            //         <PersonFill />
            //         Sign in
            //       </NavDropdown.Item>
            //       <NavDropdown.Item id="login-dropdown-sign-up" href="/auth/signup">
            //         <PersonPlusFill />
            //         Sign up
            //       </NavDropdown.Item>
            //     </NavDropdown>
            //   )}
            // </Nav>
