import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

// Simple math CAPTCHA component
const MathCaptcha = ({ onVerify }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setCaptchaError] = useState('');

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setNum1(a);
    setNum2(b);
    setAnswer('');
    setVerified(false);
    setCaptchaError('');
    onVerify(false);
  };

  const checkAnswer = (val) => {
    setAnswer(val);
    if (parseInt(val) === num1 + num2) {
      setVerified(true);
      setCaptchaError('');
      onVerify(true);
    } else {
      setVerified(false);
      onVerify(false);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-blue-50">
      <p className="text-sm font-medium text-gray-700 mb-2">
        🤖 CAPTCHA Verification
      </p>
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-md tracking-widest select-none">
          {num1} + {num2} = ?
        </span>
        <input
          type="number"
          value={answer}
          onChange={(e) => checkAnswer(e.target.value)}
          placeholder="Answer"
          className={`w-24 border rounded-lg px-3 py-1 text-center focus:outline-none focus:ring-2 ${
            verified
              ? 'border-green-400 focus:ring-green-200 bg-green-50'
              : 'border-gray-300 focus:ring-blue-200'
          }`}
        />
        <button
          type="button"
          onClick={generateCaptcha}
          className="text-sm text-blue-600 hover:underline"
        >
          🔄 Refresh
        </button>
        {verified && (
          <span className="text-green-600 font-semibold text-sm">✓ Verified</span>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

const ContactPage = () => {
  const { user } = useAuth();

  const [inquiryType, setInquiryType] = useState('General');
  const [donationType, setDonationType] = useState('Money');
  const [recipientGroup, setRecipientGroup] = useState('Refugees');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!captchaVerified) {
      setError('Please complete the CAPTCHA verification.');
      return;
    }

    setLoading(true);

    // Build the full contact payload
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      message: formData.message,
      inquiry_type: inquiryType,
      // Only include donation fields if inquiry is Donation related
      ...(inquiryType === 'Donation' && {
        donation_type: donationType,
        recipient_group: recipientGroup,
      }),
    };

    try {
      // Replace with your actual contact endpoint if you have one
      // For now we simulate a successful submission
      await new Promise((res) => setTimeout(res, 1200));

      console.log('Contact form submitted:', payload);
      setSuccess(true);
      setFormData({ firstName: '', lastName: '', email: user?.email || '', message: '' });
      setInquiryType('General');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md w-full">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Message Sent!</h2>
          <p className="text-gray-500 mb-8">
            Thank you for reaching out. Our team will get back to you within 24–48 hours.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Get In Touch</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
          Have a question, want to donate, or just want to say hi? We'd love to hear from you.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">

          {/* Step 1: Inquiry Type */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              1. Type of Inquiry
            </h2>
            <div className="flex flex-wrap gap-3">
              {['General', 'Donation', 'Volunteering', 'Partnership', 'Other'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setInquiryType(type)}
                  className={`px-4 py-2 rounded-full border transition font-medium ${
                    inquiryType === type
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Donation fields — only shown if inquiry is Donation */}
          {inquiryType === 'Donation' && (
            <>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  2. Donation Type
                </h2>
                <div className="flex flex-wrap gap-3">
                  {['Money', 'Food', 'Clothes', 'Other'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDonationType(type)}
                      className={`px-4 py-2 rounded-full border transition font-medium ${
                        donationType === type
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  3. Recipient Group
                </h2>
                <div className="flex flex-wrap gap-3">
                  {['Refugees', 'Orphans', 'Street Families', 'War-affected'].map((group) => (
                    <button
                      key={group}
                      type="button"
                      onClick={() => setRecipientGroup(group)}
                      className={`px-4 py-2 rounded-full border transition font-medium ${
                        recipientGroup === group
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Your Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {inquiryType === 'Donation' ? '4.' : '2.'} Your Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Jane"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="jane@example.com"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                placeholder="Tell us how you can help you..."
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* CAPTCHA */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {inquiryType === 'Donation' ? '5.' : '3.'} Verify You're Human
            </h2>
            <MathCaptcha onVerify={setCaptchaVerified} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !captchaVerified}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-full font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </form>

        {/* Contact Info */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { icon: '📧', label: 'Email', value: 'hello@hopeconnect.org' },
            { icon: '📞', label: 'Phone', value: '+254 700 000 000' },
            { icon: '📍', label: 'Location', value: 'Nairobi, Kenya' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl shadow p-6">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-sm text-gray-500 font-medium">{item.label}</p>
              <p className="text-gray-800 font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;