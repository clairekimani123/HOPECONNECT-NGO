import React, { useState, useEffect } from 'react';
import { trackEvent } from '../analytics';

const DonatePage = () => {
  const [donationType, setDonationType] = useState('Money');
  const [recipientGroup, setRecipientGroup] = useState('Refugees');
  const [formData, setFormData] = useState({ amount: '', phone: '', description: '', name: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // NEW — project selection state
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState(''); // '' = general donation, not tied to a project
  const [loadingProjects, setLoadingProjects] = useState(true);

  // NEW — fetch the list of projects so the donor can pick which one to fund
  useEffect(() => {
    fetch('https://connect-backend-8x61.onrender.com/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch(() => setProjects([]))
      .finally(() => setLoadingProjects(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDonationTypeChange = (type) => {
    setDonationType(type);
    trackEvent('Donation', 'Type Selected', type);
  };

  const handleRecipientChange = (group) => {
    setRecipientGroup(group);
    trackEvent('Donation', 'Recipient Selected', group);
  };

  // NEW — track which project a donor chose to fund
  const handleProjectChange = (id) => {
    setProjectId(id);
    const project = projects.find((p) => p.id === Number(id));
    trackEvent('Donation', 'Project Selected', project ? project.type : 'General');
  };

  const resetForm = () => {
    setFormData({ amount: '', phone: '', description: '', name: '', email: '' });
    setDonationType('Money');
    setRecipientGroup('Refugees');
    setProjectId(''); // NEW
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    trackEvent('Donation', 'Form Submitted', `${donationType}-${recipientGroup}`);

    try {
      const token = localStorage.getItem('access_token');

      // NEW — project_id included in both payload branches.
      // Sent as a number if a project was picked, or omitted entirely for
      // a general donation not tied to any specific project.
      const project_id = projectId ? Number(projectId) : undefined;

      const payload = donationType === 'Money'
        ? {
            phone_number: formData.phone,
            amount: parseInt(formData.amount),
            group: recipientGroup,
            details: formData.description || 'HopeConnect Donation',
            project_id, // NEW
          }
        : {
            type: donationType.toLowerCase(),
            group: recipientGroup,
            description: formData.description,
            phone: formData.phone,
            user_id: JSON.parse(localStorage.getItem('user'))?.id,
            project_id, // NEW
          };

      const endpoint = donationType === 'Money'
        ? 'https://connect-backend-8x61.onrender.com/donations/mpesa'
        : 'https://connect-backend-8x61.onrender.com/donations';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('✅ Backend response:', data);

      if (!response.ok) {
        throw new Error(data.msg || data.error || 'Donation failed');
      }

      trackEvent('Donation', 'Success', `${donationType}-${recipientGroup}`);
      setSubmitted(true);

      if (donationType === 'Money' && data.checkout_request_id) {
        alert('📱 STK Push sent! Check your phone to enter your M-Pesa PIN.');
      }

    } catch (error) {
      console.error('❌ Donation error:', error);
      trackEvent('Donation', 'Error', error.message);
      alert(`Donation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    const selectedProject = projects.find((p) => p.id === Number(projectId));
    return (
      <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 min-h-screen pt-20 flex items-center justify-center">
        <div className="p-8 md:p-12 bg-white rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="text-6xl mb-6">🙏</div>
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-2">Your generosity makes a real difference.</p>
          <p className="text-gray-500 text-sm mb-2">
            {donationType === 'Money'
              ? `KES ${formData.amount} donation for ${recipientGroup} has been received.`
              : `Your ${donationType} donation for ${recipientGroup} has been received.`}
          </p>
          {/* NEW — confirm which project, if one was chosen */}
          {selectedProject && (
            <p className="text-gray-500 text-sm mb-8">
              This will go toward <span className="font-semibold">{selectedProject.type}</span>.
            </p>
          )}
          <button
            onClick={resetForm}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transition"
          >
            Make Another Donation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 pt-20">
      <section className="max-w-4xl mx-auto px-4 py-10 rounded-2xl">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Make a Donation</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">Your contribution, no matter the size, creates a world of difference.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 rounded-2xl shadow-2xl p-4">

          {/* NEW — project selector, step 1 in the flow since it frames everything after */}
          <div>
            <h2 className="text-xl font-semibold mb-4">1. Choose a Project (optional)</h2>
            {loadingProjects ? (
              <p className="text-sm text-gray-500">Loading projects...</p>
            ) : (
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => handleProjectChange('')}
                  className={`px-4 py-2 rounded-full border transition ${projectId === '' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                >
                  General Fund
                </button>
                {projects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => handleProjectChange(project.id)}
                    className={`px-4 py-2 rounded-full border transition ${Number(projectId) === project.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                  >
                    {project.type}
                  </button>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Choosing a project lets you track exactly how your donation is used on that project's transparency page.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">2. Choose Donation Type</h2>
            <div className="flex flex-wrap gap-4">
              {['Money', 'Food', 'Clothes', 'Other'].map((type) => (
                <button key={type} type="button"
                  onClick={() => handleDonationTypeChange(type)}
                  className={`px-4 py-2 rounded-full border transition ${donationType === type ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">3. Choose Recipient Group</h2>
            <div className="flex flex-wrap gap-4">
              {['Refugees', 'Orphans', 'Street Families', 'War-affected'].map((group) => (
                <button key={group} type="button"
                  onClick={() => handleRecipientChange(group)}
                  className={`px-4 py-2 rounded-full border transition ${recipientGroup === group ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>
                  {group}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">4. Donation Details</h2>
            {donationType === 'Money' ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block mb-2 font-medium">Phone Number (for M-Pesa)</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange}
                    placeholder="e.g., 0712345678" required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="amount" className="block mb-2 font-medium">Amount (KES)</label>
                  <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleInputChange}
                    placeholder="e.g., 1000" required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none" />
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="description" className="block mb-2 font-medium">Describe your donation</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleInputChange}
                  rows="3" placeholder='e.g., "De bon cœur"' required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"></textarea>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">5. Your Details</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 font-medium">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange}
                placeholder="Your Name" required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 font-medium">Email Address</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange}
                placeholder="Your Email" required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 flex items-center gap-2">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              'Proceed with Donation'
            )}
          </button>
        </form>
      </section>
    </div>
  );
};

export default DonatePage;