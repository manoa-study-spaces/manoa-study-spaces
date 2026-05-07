"use client";

import './profile.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import SpaceCard, { Listing } from '@/components/SpaceCard';
import StudyGroupCard, { StudyGroup } from '@/components/StudyGroupCard';

type ProfileShape = {
	fullName?: string;
	username?: string;
	email?: string;
	major?: string;
	standing?: string | null;
	interests?: string;
	classes?: string;
	status?: string;
	picture?: Array<{ fileName: string }>;
	pictureUrl?: string;
	// client-only lists persisted in localStorage
	savedSpaces?: number[];
	joinedStudyGroups?: number[];
	addedSpaces?: number[];
};

export default function ProfileClient({ profile, email }: { profile: ProfileShape | null; email?: string }) {
		// Start with the server-provided profile so server and client initial DOM match.
		const [clientProfile, setClientProfile] = useState<ProfileShape | null>(profile);

		// Merge localStorage fallback on the client after hydration. This avoids
		// reading `window` during server render and prevents hydration mismatch.
		useEffect(() => {
			if (typeof window === 'undefined' || !email) return;
			try {
				const raw = window.localStorage.getItem(`profile:${email}`);
				if (!raw) return;
				const parsed = JSON.parse(raw) as Record<string, unknown>;

				// eslint-disable-next-line react-hooks/set-state-in-effect
				setClientProfile((prev) => ({ ...(prev ?? {}), ...(parsed ?? {}) } as ProfileShape));
			} catch {
				// ignore parse errors
			}
		}, [email]);

	if (!clientProfile) {
		return (
			<div style={{ padding: 24 }}>
				<h2>Profile</h2>
				<p>No profile data available.</p>
			</div>
		);
	}

		const imageSrc = (clientProfile && clientProfile.picture && clientProfile.picture.length)
			? clientProfile.picture[0].fileName
			: clientProfile.pictureUrl || '';

		// Normalize status into an array for display
		const statusArray: string[] = (() => {
			const s = clientProfile.status;
			if (!s) return [];
			if (Array.isArray(s)) return s as unknown as string[];
			return (s as string).split(',').map((x) => x.trim()).filter(Boolean);
		})();

		const hasAbout = !!(clientProfile.interests || clientProfile.classes || statusArray.length);

					return (
						<div className="profile-page">
							<div className="profile-main-grid">
								{/* Left column: avatar, name, email, major, standing, about, edit */}
								<div className="profile-left">
									<div className="study-group-card profile-box">
										<div className="profile-avatar-wrap">
											<div className="profile-image avatar-large">
												{imageSrc ? (
													<Image src={imageSrc} alt="profile" width={120} height={120} style={{ borderRadius: '50%' }} />
												) : (
													// compute initials from name/username
													(() => {
														const name = (clientProfile.fullName || clientProfile.username || '').trim();
														if (!name) return (
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
											<h2 className="profile-name centered">{clientProfile.fullName || 'No name provided'}</h2>
											{clientProfile.username && <div className="profile-username centered">@{clientProfile.username}</div>}
										</div>

										{clientProfile.email && (
											<div className="profile-email-row">
												<span className="email-icon">✉️</span>
												<span className="profile-email">{clientProfile.email}</span>
											</div>
										)}

										<div className="profile-major">
											<div><strong>Major:</strong> {clientProfile.major || ''}</div>
											{clientProfile.standing ? <div><strong>Standing:</strong> {clientProfile.standing}</div> : null}
										</div>

										{hasAbout ? (
											<section className="profile-about">
												<h3>About</h3>
												{clientProfile.interests ? (
													<div><strong>Interests:</strong> {clientProfile.interests}</div>
												) : null}
												{clientProfile.classes ? (
													<div className="profile-about-row"><strong>Classes:</strong> {clientProfile.classes}</div>
												) : null}
												{statusArray.length ? (
													<div className="profile-about-row">
														<strong>Status:</strong>
														<ul className="profile-status-list">
															{statusArray.map((s, i) => (
																<li key={i}>{s}</li>
															))}
														</ul>
													</div>
												) : null}
											</section>
										) : null}

										<div className="profile-edit-bottom">
											<a className="btn btn-success" href="/profile/edit">Edit Profile</a>
										</div>
									</div>
								</div>

								{/* Right column: Added Spaces, Study Groups, Favorited Spaces (stacked) */}
								<div className="profile-right">
									<div className="study-group-card profile-box">
										<h3>Added Spaces</h3>
										{(() => {
											const added: number[] = clientProfile.addedSpaces || [];
											if (!added || added.length === 0) return <p className="muted">(No spaces added yet)</p>;

											return (
												<>
													<div style={{ marginTop: 8 }}>
														{added.slice(0, 2).map((id) => (
															<div key={id} style={{ marginBottom: 8 }}>
																<ProfileSavedListing id={id} email={clientProfile && clientProfile.email} />
															</div>
														))}
													</div>
													<div style={{ marginTop: 8 }}>
														<a className="btn btn-link" href="/profile/added-spaces">View all ({added.length})</a>
													</div>
												</>
											);
										})()}
									</div>

									<div className="study-group-card profile-box" style={{ marginTop: 16 }}>
										<h3>Study Groups</h3>
										{(() => {
											const joined: number[] = clientProfile.joinedStudyGroups || [];
											if (!joined || joined.length === 0) return <p className="muted">(Not a member of any study groups yet)</p>;

											return (
												<>
													<div style={{ marginTop: 8 }}>
														{joined.slice(0, 2).map((id) => (
															<div key={id} style={{ marginBottom: 8 }}>
																<ProfileStudyGroupListing id={id} />
															</div>
														))}
													</div>
													<div style={{ marginTop: 8 }}>
														<a className="btn btn-link" href="/profile/study-groups">View all ({joined.length})</a>
													</div>
												</>
											);
										})()}
									</div>

									<div className="study-group-card profile-box" style={{ marginTop: 16 }}>
										<h3>Saved Spaces</h3>
										{(() => {
											const saved: number[] = clientProfile.savedSpaces || [];
											if (!saved || saved.length === 0) return <p className="muted">(No spaces favorited yet)</p>;

											return (
												<>
													<div style={{ marginTop: 8 }}>
														{/** Fetch up to 2 saved listings client-side */}
														{saved.slice(0, 2).map((id) => (
															<div key={id} style={{ marginBottom: 8 }}>
																<ProfileSavedListing id={id} email={clientProfile && clientProfile.email} />
															</div>
														))}
													</div>
													<div style={{ marginTop: 8 }}>
														<a className="btn btn-link" href="/profile/saved">View all ({saved.length})</a>
													</div>
												</>
											);
										})()}
									</div>
								</div>
							</div>
						</div>
					);
}

function ProfileSavedListing({ id, email }: { id: number; email?: string }) {
	const [listing, setListing] = useState<Listing | null>(null);

	useEffect(() => {
		let cancelled = false;
		fetch(`/api/listings?ids=${id}`).then((r) => r.json()).then((data) => {
			if (cancelled) return;
			const l = (data.listings && data.listings[0]) || null;
			setListing(l as Listing | null);
		}).catch(() => {});
		return () => { cancelled = true; };
	}, [id]);

	if (!listing) return <div className="muted">Loading...</div>;

	return <SpaceCard listing={listing} href={`/list/${listing.listingID}`} email={email} />;
}

function ProfileStudyGroupListing({ id }: { id: number }) {
	const [group, setGroup] = useState<StudyGroup | null>(null);

	useEffect(() => {
		let cancelled = false;
		fetch(`/api/studygroups?ids=${id}`).then((r) => r.json()).then((data) => {
			if (cancelled) return;
				const g = (data.groups && data.groups[0]) || null;
				if (g) (g as StudyGroup).isJoined = true;
			setGroup(g as StudyGroup | null);
		}).catch(() => {});
		return () => { cancelled = true; };
	}, [id]);

	if (!group) return <div className="muted">Loading...</div>;

	return <StudyGroupCard group={group} />;
}
