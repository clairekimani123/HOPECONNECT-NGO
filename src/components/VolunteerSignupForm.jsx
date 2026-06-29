import React, { useState } from 'react';
import { trackEvent } from '../analytics';

/**
 * VolunteerSignupForm — a modal collecting full volunteer details before
 * actually signing someone up, instead of the old one-click toggle that
 * only ever stored the account's existing email.
 *
 * Props:
 *   project   - the project object being volunteered for (uses project.id, project.type)
 *   user      - the logged-in user object (used to prefill + as user_id on submit)
 *   onClose   - called to dismiss the modal without submitting
 *   onSuccess - called after a successful signup, so the parent page can
 *               update its own volunteerStatus state
 */
function VolunteerSignupForm({ project, user, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    full_name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '',
    email: user?.email || '',
    phone_number: '',
    availability: '',
    skills: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('https://connect-backend-8x61.onrender.com/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          event_id: project.id,
          email: formData.email,
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          availability: formData.availability,
          skills: formData.skills,
          notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign up.');
      }

      trackEvent('Volunteer', 'Signed Up', project.type);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-5 rounded-t-2xl flex items-center justify-between">
          <div>
            <h3 className="text-white text-lg font-bold">Volunteer Signup</h3>
            <p className="text-white text-sm opacity-90">{project.type}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white text-2xl leading-none hover:opacity-75"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-1 font-medium text-sm">Full Name</label>
            <input
              type="text" name="full_name" value={formData.full_name} onChange={handleChange}
              required placeholder="Your full name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          {/* Project selector — same project list the donation form uses,
              prefilled with whichever project this modal was opened from,
              but still changeable in case the volunteer wants a different one. */}
          <div>
            <label className="block mb-1 font-medium text-sm">Project</label>
            <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 text-sm">
              {project.type} <span className="text-gray-400">(selected from project page)</span>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Phone Number</label>
            <input
              type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange}
              required placeholder="e.g., 0712345678"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Email Address</label>
            <input
              type="email" name="email" value={formData.email} onChange={handleChange}
              required placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Availability</label>
            <select
              name="availability" value={formData.availability} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
            >
              <option value="">Select availability</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="evenings">Evenings</option>
              <option value="flexible">Flexible / Anytime</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Relevant Skills <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text" name="skills" value={formData.skills} onChange={handleChange}
              placeholder="e.g., first aid, driving, teaching"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Anything else? <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              name="notes" value={formData.notes} onChange={handleChange} rows="2"
              placeholder="Let us know anything that would help us place you well"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={submitting}
              className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Confirm Signup'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VolunteerSignupForm;