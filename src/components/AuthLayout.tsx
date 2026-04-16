interface AuthLayoutProps {
  children: React.ReactNode;
  activeTab: 'signin' | 'signup';
  onTabChange: (tab: 'signin' | 'signup') => void;
}

export default function AuthLayout({ children, activeTab, onTabChange }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-sidebar">
        <div className="auth-sidebar-content">
          <div className="sidebar-top">
            <h1 className="sidebar-hero-title">
              <span>Study Spaces</span>
              <span>at UH Manoa</span>
            </h1>
          </div>
          <div className="sidebar-bottom">
            <p className="sidebar-hero-subtitle">
              Find study spots, connect with fellow students, and make the most of campus - all in one place.
            </p>
            <div className="sidebar-pill-list">
              <span className="sidebar-pill">Study spaces</span>
              <span className="sidebar-pill">Group learning</span>
              <span className="sidebar-pill">UH community</span>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-main">
        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => onTabChange('signin')}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => onTabChange('signup')}
          >
            Sign Up
          </button>
        </div>
        <div className="auth-form-area">{children}</div>
      </div>
    </div>
  );
}
