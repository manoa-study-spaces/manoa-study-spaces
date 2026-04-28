"use client";

import './profile.css';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type ProfileShape = {
  fullName?: string;
  username?: string;
  major?: string;
  standing?: string | null;
  interests?: string;
  classes?: string;
  status?: string | string[];
  picture?: Array<{ fileName: string }>;
  pictureUrl?: string;
};

export default function EditProfileForm({ profile, email }: { profile?: ProfileShape | null; email?: string }) {
  const router = useRouter();

  // Lazy initializer: merge DB profile with localStorage fallback when available.
  const [form, setForm] = useState(() => {
    const base = {
      fullName: profile?.fullName || '',
      username: profile?.username || '',
      major: profile?.major || '',
      standing: profile?.standing || '',
      interests: profile?.interests || '',
      classes: profile?.classes || '',
      status: Array.isArray(profile?.status) ? profile!.status : (profile?.status ? [profile.status as string] : []),
    } as {
      fullName: string;
      username: string;
      major: string;
      standing: string;
      interests: string;
      classes: string;
      status: string[];
    };

    try {
      if (typeof window !== 'undefined' && email) {
        const raw = window.localStorage.getItem(`profile:${email}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          base.fullName = base.fullName || parsed.fullName || '';
          base.username = base.username || parsed.username || '';
          base.major = base.major || parsed.major || '';
          base.standing = base.standing || parsed.standing || '';
          base.interests = base.interests || parsed.interests || '';
          base.classes = base.classes || parsed.classes || '';
          base.status = (Array.isArray(base.status) && base.status.length) ? base.status : (Array.isArray(parsed.status) ? parsed.status : (parsed.status ? [parsed.status] : []));
        }
      }
    } catch {
      // ignore
    }

    return base;
  });

  const [imageData, setImageData] = useState<string | null>(() => {
    const fromProfile = profile?.picture?.[0]?.fileName || profile?.pictureUrl || null;
    if (typeof window !== 'undefined' && email) {
      try {
        const raw = window.localStorage.getItem(`profile:${email}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          return fromProfile || parsed.pictureUrl || null;
        }
      } catch {
        // ignore
      }
    }
    return fromProfile;
  });
  const [removeImage, setRemoveImage] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // localStorage merging handled in the lazy initializer above; no runtime effects needed.

  const handleFile = async (file?: File) => {
    if (!file) return setImageData(null);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // center-crop to square using canvas
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, 512, 512);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setImageData(dataUrl);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
    // If user selects a new file, unset removeImage
    setRemoveImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const payload = {
      fullName: form.fullName,
      username: form.username,
      major: form.major,
      standing: form.standing,
      interests: form.interests,
      classes: form.classes,
      status: form.status,
      pictureUrl: imageData,
      removeImage,
      email,
    };

    const res = await fetch('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      // Update localStorage fallback so profile page immediately shows new values
      try {
        if (typeof window !== 'undefined' && email) {
          const profileFallback = {
            fullName: payload.fullName,
            username: payload.username,
            email: payload.email,
            major: payload.major,
            standing: payload.standing,
            interests: payload.interests,
            classes: payload.classes,
            pictureUrl: payload.pictureUrl,
            status: Array.isArray(payload.status) ? payload.status : (payload.status ? [payload.status] : []),
          };
          window.localStorage.setItem(`profile:${email}`, JSON.stringify(profileFallback));
        }
      } catch {}

      setMessage('Saved successfully. Redirecting...');
      // short delay so user sees success message
      setTimeout(() => router.push('/profile'), 600);
    } else {
      setMessage('Failed to save profile.');
    }
    setIsSaving(false);
  };

  return (
    <div className="profile-edit-page">
      <form onSubmit={handleSubmit} className="profile-edit-form">
        <h2>Edit Profile</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <div>
            <div className="profile-image" style={{ width: 128, height: 128, borderRadius: 8 }}>
              {imageData ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageData} alt="preview" />
              ) : (
                (() => {
                  const name = (form.fullName || form.username || '').trim();
                  if (!name) {
                    return (
                      <div className="profile-placeholder" role="img" aria-label="No profile image">
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
                          <defs>
                            <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="100%">
                              <stop offset="0%" stopColor="#f5f7f6" />
                              <stop offset="50%" stopColor="#eef1f0" />
                              <stop offset="100%" stopColor="#ffffff" />
                            </linearGradient>
                          </defs>
                          <rect x="0" y="0" width="100" height="100" rx="50" ry="50" fill="url(#g1)" />
                          <g transform="translate(0,0)">
                            <circle cx="50" cy="40" r="18" fill="#fff" />
                            <path d="M22 82c3-16 16-28 28-28s25 12 28 28H22z" fill="#fff" />
                          </g>
                        </svg>
                      </div>
                    );
                  }
                  const parts = name.split(/\s+/).filter(Boolean);
                  const initials = (parts.length === 1) ? (parts[0][0] || '').toUpperCase() : ((parts[0][0] || '') + (parts[parts.length-1][0] || '')).toUpperCase();
                  return (
                    <div className="profile-placeholder" role="img" aria-label={"Profile initials: " + initials}>
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
                        <defs>
                          <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="100%">
                            <stop offset="0%" stopColor="#f5f7f6" />
                            <stop offset="50%" stopColor="#eef1f0" />
                            <stop offset="100%" stopColor="#ffffff" />
                          </linearGradient>
                        </defs>
                        <rect x="0" y="0" width="100" height="100" rx="50" ry="50" fill="url(#g1)" />
                        <text x="50%" y="58%" textAnchor="middle" fontSize="34" fontWeight="700" fill="#124636" fontFamily="sans-serif">{initials}</text>
                      </svg>
                    </div>
                  );
                })()
              )}
            </div>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} />
              <button type="button" className="btn btn-outline-dark" onClick={() => { setImageData(null); setRemoveImage(true); if (fileRef.current) fileRef.current.value = ''; }}>Remove image</button>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <label>Name</label>
            <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />

            <label>Username</label>
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />

            <label>Major</label>
            <input value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} />

            <label>Standing</label>
            <select value={String(form.standing ?? '')} onChange={(e) => setForm({ ...form, standing: e.target.value })} className="auth-form-input">
              <option value="">Select standing</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophmore">Sophmore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Graduate">Graduate</option>
              <option value="Other">Other</option>
            </select>

            <label>Interests</label>
            <textarea value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} />

            <label>Classes</label>
            <textarea value={form.classes} onChange={(e) => setForm({ ...form, classes: e.target.value })} />

            <label style={{ marginTop: 10 }}>Status — select all that apply</label>
            <div className="status-options" style={{ marginTop: 6 }}>
              {[
                'Open to studying with a group',
                'Open to meeting new people',
                'Prefer studying alone',
                'Looking for study space recommendations',
                'Currently studying for a specific test, lesson, or class',
              ].map((opt) => (
                <label key={opt} className="status-option" style={{ display: 'inline-flex', alignItems: 'center', marginRight: 8 }}>
                  <input
                    type="checkbox"
                    value={opt}
                    checked={Array.isArray(form.status) ? (form.status as string[]).includes(opt) : false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setForm((prev) => {
                        const existing = Array.isArray(prev.status) ? prev.status.slice() : [];
                        if (checked) {
                          existing.push(opt);
                        } else {
                          const idx = existing.indexOf(opt);
                          if (idx >= 0) existing.splice(idx, 1);
                        }
                        return { ...prev, status: existing };
                      });
                    }}
                  />
                  <span className="status-pill" style={{ marginLeft: 6 }}>{opt}</span>
                </label>
              ))}
            </div>

            <div style={{ marginTop: 12 }}>
              <button type="submit" className="btn btn-primary" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
              <a className="btn btn-secondary" style={{ marginLeft: 8 }} href="/profile">Cancel</a>
              {message && <div style={{ marginTop: 8, color: message.includes('Failed') ? '#d32f2f' : '#2e7d32' }}>{message}</div>}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
