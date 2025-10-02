import { useEffect, useState } from "react";
import { profileApi } from "../api/profile";
import { AuthUser } from "../types";
import { useAuth } from "../hooks/useAuth";
import AppHeader from "../components/AppHeader";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(user);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileApi.getProfile();
        setProfile(data);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;

    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const updated = await profileApi.updateProfile({
        fullName: profile.fullName,
        bio: profile.bio ?? "",
        avatarUrl: profile.avatarUrl ?? "",
      });
      setProfile(updated);
      setUser(updated);
      setMessage("Profile updated successfully");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="layout">
        <AppHeader />
        <div className="page">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="layout">
        <AppHeader />
        <div className="page">
          <p>We could not load your profile. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <AppHeader />
      <div className="page">
        <div className="page-header">
          <div>
            <h1>My profile</h1>
            <p className="subtitle">Update your information to personalize your journal.</p>
          </div>
        </div>
        <form className="profile-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input value={profile.fullName} onChange={(event) => setProfile({ ...profile, fullName: event.target.value })} required />
          </label>
        <label>
          Avatar URL
          <input value={profile.avatarUrl ?? ""} onChange={(event) => setProfile({ ...profile, avatarUrl: event.target.value })} placeholder="https://..." />
        </label>
        <label>
          Bio
          <textarea value={profile.bio ?? ""} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} rows={4} placeholder="Tell other travelers about yourself" />
        </label>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
          <button type="submit" className="primary" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
