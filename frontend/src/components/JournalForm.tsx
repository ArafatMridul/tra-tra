import { useEffect, useState } from "react";
import { journalApi } from "../api/journal";
import { useJournalStore } from "../store/journalStore";
import { format } from "date-fns";

const createDefaultFormState = () => ({
  title: "",
  description: "",
  city: "",
  country: "",
  visitedDate: format(new Date(), "yyyy-MM-dd"),
  companions: "",
  rating: "",
});

const JournalForm = () => {
  const { pendingEntry, addEntry, setPendingEntry, setMapCenter } = useJournalStore();
  const [form, setForm] = useState(createDefaultFormState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pendingEntry) {
      setForm(() => {
        const base = createDefaultFormState();
        return {
          ...base,
          city: pendingEntry.city ?? base.city,
          country: pendingEntry.country ?? base.country,
        };
      });
    }
  }, [pendingEntry]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pendingEntry) {
      setError("Please pick a location on the map first.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const entry = await journalApi.create({
        title: form.title,
        description: form.description || undefined,
        city: form.city || pendingEntry.city || "",
        country: form.country || pendingEntry.country || "",
        latitude: pendingEntry.lat,
        longitude: pendingEntry.lng,
        visitedDate: form.visitedDate,
        companions: form.companions || undefined,
        rating: form.rating || undefined,
      });
      addEntry(entry);
      setPendingEntry(null);
      setForm(createDefaultFormState());
      setMapCenter({ lat: entry.latitude, lng: entry.longitude });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Unable to save journal entry");
    } finally {
      setSaving(false);
    }
  };

  if (!pendingEntry) {
    return (
      <div className="placeholder">
        <h2>Select a spot on the map</h2>
        <p>Click on the map to start a new travel memory. We'll fill in the location details for you automatically.</p>
      </div>
    );
  }

  return (
    <form className="journal-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} placeholder="Sunset at Marina Bay" required />
        </label>
        <label>
          Date visited
          <input name="visitedDate" type="date" value={form.visitedDate} onChange={handleChange} required />
        </label>
      </div>
      <div className="form-row">
        <label>
          City
          <input name="city" value={form.city} onChange={handleChange} placeholder="City" required />
        </label>
        <label>
          Country
          <input name="country" value={form.country} onChange={handleChange} placeholder="Country" required />
        </label>
      </div>
      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="What made this place special?"
          rows={4}
        />
      </label>
      <div className="form-row">
        <label>
          Travel companions
          <input name="companions" value={form.companions} onChange={handleChange} placeholder="Who joined you?" />
        </label>
        <label>
          Rating
          <input name="rating" value={form.rating} onChange={handleChange} placeholder="Must-see, hidden gem..." />
        </label>
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit" className="primary" disabled={saving}>
        {saving ? "Saving..." : "Save entry"}
      </button>
    </form>
  );
};

export default JournalForm;
