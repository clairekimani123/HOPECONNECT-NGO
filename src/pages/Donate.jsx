import React, { useState, useEffect, useRef } from 'react';
import { trackEvent } from '../analytics';

const DonatePage = () => {
  const [donationType, setDonationType] = useState('Money');
  const [formData, setFormData] = useState({ amount: '', phone: '', description: '', name: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Project selection — this REPLACES the old "recipient group" buttons.
  // Whichever project a donor picks IS the recipient; there is no second,
  // disconnected category to choose anymore.
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Payment confirmation polling state
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // null | 'pending' | 'completed' | 'failed'
  const pollRef = useRef(null);

  useEffect(() => {
    fetch('https://connect-backend-8x61.onrender.com/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch(() => setProjects([]))
      .finally(() => setLoadingProjects(false));
  }, []);

  // Poll for payment confirmation once an M-Pesa request is in flight.
  // Safaricom's callback updates the donation asynchronously — this is
  // what lets the UI actually reflect that, instead of assuming success
  // the moment the STK push is sent.
  useEffect(() => {
    if (!checkoutRequestId || paymentStatus === 'completed' || paymentStatus === 'failed') {
      return;
    }

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `https://connect-backend-8x61.onrender.com/donations/mpesa/status/${checkoutRequestId}`
        );
        const data = await res.json();
        if (data.status === 'completed' || data.status === 'failed') {
          setPaymentStatus(data.status);
          clearInterval(pollRef.current);
        }
      } catch {
        // network hiccup — let the interval try again on the next tick
      }
    }, 3000); // check every 3s

    // Stop polling after 2 minutes either way, so a closed/never-completed
    // payment doesn't poll forever in the background
    const timeout = setTimeout(() => {
      clearInterval(pollRef.current);
      if (paymentStatus === 'pending') setPaymentStatus('timeout');
    }, 120000);

    return () => {
      clearInterval(pollRef.current);
      clearTimeout(timeout);
    };
  }, [checkoutRequestId, paymentStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDonationTypeChange = (type) => {
    setDonationType(type);
    trackEvent('Donation', 'Type Selected', type);
  };

  const handleProjectChange = (id) => {
    setProjectId(id);
    const project = projects.find((p) => p.id === Number(id));
    trackEvent('Donation', 'Project Selected', project ? project.type : 'General');
  };

  const resetForm = () => {
    setFormData({ amount: '', phone: '', description: '', name: '', email: '' });
    setDonationType('Money');
    setProjectId('');
    setSubmitted(false);
    setCheckoutRequestId(null);
    setPaymentStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    trackEvent('Donation', 'Form Submitted', donationType);

    try {
      const token = localStorage.getItem('access_token');
      const project_id = projectId ? Number(projectId) : undefined;

      const payload = donationType === 'Money'
        ? {
            phone_number: formData.phone,
            amount: parseInt(formData.amount),
            group: projects.find((p) => p.id === project_id)?.type || 'General Fund',
            details: formData.description || 'HopeConnect Donation',
            project_id,
          }
        : {
            type: donationType.toLowerCase(),
            group: projects.find((p) => p.id === project_id)?.type || 'General Fund',
            description: formData.description,
            phone: formData.phone,
            user_id: JSON.parse(localStorage.getItem('user'))?.id,
            project_id,
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

      if (!response.ok) {
        throw new Error(data.msg || data.error || 'Donation failed');
      }

      trackEvent('Donation', 'Success', donationType);

      if (donationType === 'Money' && data.checkout_request_id) {
        // Money/M-Pesa — don't show "Thank You" yet. Show the awaiting
        // screen and start polling, since the payment isn't confirmed.
        setCheckoutRequestId(data.checkout_request_id);
        setPaymentStatus('pending');
      } else {
        // Non-mpesa donations have no confirmation step, so this is the
        // final state immediately.
        setSubmitted(true);
      }

    } catch (error) {
      trackEvent('Donation', 'Error', error.message);
      alert(`Donation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedProject = projects.find((p) => p.id === Number(projectId));

  // ── Awaiting M-Pesa confirmation screen ──────────────────────────────────
  if (paymentStatus === 'pending') {
    return (
      <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 min-h-screen pt-20 flex items-center justify-center">
        <div className="p-8 md:p-12 bg-white rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-blue-600 mb-3">Check your phone</h2>
          <p className="text-gray-600 mb-2">Enter your M-Pesa PIN to complete the donation.</p>
          <p className="text-gray-400 text-sm">Waiting for confirmation...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'completed') {
    return (
      <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 min-h-screen pt-20 flex items-center justify-center">
        <div className="p-8 md:p-12 bg-white rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="text-6xl mb-6">🙏</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">Payment Confirmed!</h2>
          <p className="text-gray-600 mb-2">Your donation has been received.</p>
          {selectedProject && (
            <p className="text-gray-500 text-sm mb-8">
              This goes toward <span className="font-semibold">{selectedProject.type}</span> — you can see it
              reflected on that project's transparency page right away.
            </p>
          )}
          <button onClick={resetForm}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transition">
            Make Another Donation
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed' || paymentStatus === 'timeout') {
    return (
      <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 min-h-screen pt-20 flex items-center justify-center">
        <div className="p-8 md:p-12 bg-white rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-red-500 mb-3">
            {paymentStatus === 'timeout' ? "We didn't hear back" : 'Payment not completed'}
          </h2>
          <p className="text-gray-600 mb-8 text-sm">
            {paymentStatus === 'timeout'
              ? "We didn't receive confirmation in time. If you completed the payment, it may still go through shortly."
              : 'The payment was cancelled or did not go through. No donation was recorded.'}
          </p>
          <button onClick={resetForm}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 min-h-screen pt-20 flex items-center justify-center">
        <div className="p-8 md:p-12 bg-white rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="text-6xl mb-6">🙏</div>
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-2">Your {donationType.toLowerCase()} donation has been received.</p>
          {selectedProject && (
            <p className="text-gray-500 text-sm mb-8">
              This goes toward <span className="font-semibold">{selectedProject.type}</span>.
            </p>
          )}
          <button onClick={resetForm}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transition">
            Make Another Donation
          </button>
        </div>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 pt-20">
      <section className="max-w-4xl mx-auto px-4 py-10 rounded-2xl">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Make a Donation</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">Your contribution, no matter the size, creates a world of difference.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 rounded-2xl shadow-2xl p-4">

          {/* Project selector — this is now the ONLY "who is this for" question.
              The old separate Refugees/Orphans/etc group buttons are gone;
              they never corresponded to anything real. */}
          <div>
            <h2 className="text-xl font-semibold mb-4">1. Choose What to Support</h2>
            {loadingProjects ? (
              <p className="text-sm text-gray-500">Loading projects...</p>
            ) : (
              <div className="flex flex-wrap gap-4">
                <button type="button" onClick={() => handleProjectChange('')}
                  className={`px-4 py-2 rounded-full border transition ${projectId === '' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>
                  General Fund
                </button>
                {projects.map((project) => (
                  <button key={project.id} type="button" onClick={() => handleProjectChange(project.id)}
                    className={`px-4 py-2 rounded-full border transition ${Number(projectId) === project.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>
                    {project.type}
                  </button>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Your donation will be tracked against this project's transparency page.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">2. Choose Donation Type</h2>
            <div className="flex flex-wrap gap-4">
              {['Money', 'Food', 'Clothes', 'Other'].map((type) => (
                <button key={type} type="button" onClick={() => handleDonationTypeChange(type)}
                  className={`px-4 py-2 rounded-full border transition ${donationType === type ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">3. Donation Details</h2>
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
                  rows="3" required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"></textarea>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">4. Your Details</h2>
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