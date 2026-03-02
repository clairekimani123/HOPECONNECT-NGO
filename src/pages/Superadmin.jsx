import React, { useState, useEffect } from 'react';
import { FaUsers, FaCalendarAlt, FaDonate, FaTrash } from 'react-icons/fa';
import SuperAdminNavbar from '../components/SuperadminNavbar';

const SuperAdminPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("access_token");

  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [donations, setDonations] = useState([]);
  const [eventForm, setEventForm] = useState({ type: '', description: '', date: '', image_url: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoints = { users: '/users', projects: '/projects', donations: '/donations' };
      const res = await fetch(`https://connect-backend-8x61.onrender.com${endpoints[activeTab]}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (activeTab === 'users') setUsers(data);
      if (activeTab === 'projects') setProjects(data);
      if (activeTab === 'donations') setDonations(data);
    } catch {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await fetch(`https://connect-backend-8x61.onrender.com/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await fetch('https://connect-backend-8x61.onrender.com/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(eventForm)
      });
      setEventForm({ type: '', description: '', date: '', image_url: '' });
      fetchData();
    } catch {
      setError('Failed to create event');
    } finally {
      setSubmitLoading(false);
    }
  };

  const TabButton = ({ tab, icon: Icon, count }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-5 py-2 rounded-full font-semibold transition-all ${
        activeTab === tab
          ? 'bg-white text-purple-700 shadow-md'
          : 'bg-white/20 text-white hover:bg-white/30'
      }`}
    >
      <Icon className="inline mr-2" />
      {tab.charAt(0).toUpperCase() + tab.slice(1)} ({count})
    </button>
  );

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="text-center bg-white rounded-2xl p-10 shadow-xl">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-500 mt-2">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    // ✅ Gradient background applied here
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      <SuperAdminNavbar />

      <div className="max-w-6xl mx-auto p-6">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h1>

        {/* Tab Buttons */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <TabButton tab="users" icon={FaUsers} count={users.length} />
          <TabButton tab="projects" icon={FaCalendarAlt} count={projects.length} />
          <TabButton tab="donations" icon={FaDonate} count={donations.length} />
        </div>

        {error && (
          <div className="text-red-100 bg-red-500/30 border border-red-300 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          // ✅ Content card with frosted white background
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl">

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <th className="px-4 py-3 text-left rounded-tl-lg">ID</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left rounded-tr-lg">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3">{u.id}</td>
                        <td className="px-4 py-3">{u.first_name} {u.last_name}</td>
                        <td className="px-4 py-3">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {projects.map(p => (
                    <div key={p.id} className="border border-gray-200 p-4 rounded-xl relative bg-white shadow-sm">
                      <h3 className="font-bold text-gray-800">{p.type}</h3>
                      <p className="text-gray-600 text-sm mt-1">{p.description}</p>
                      <p className="text-xs text-gray-400 mt-2">{p.date}</p>
                      <button
                        onClick={() => handleDeleteEvent(p.id)}
                        className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleEventSubmit} className="space-y-4 border-t pt-6">
                  <h3 className="font-bold text-gray-700 text-lg">Add New Project</h3>
                  <input
                    type="text"
                    placeholder="Type (e.g. Health, Education)"
                    value={eventForm.type}
                    onChange={e => setEventForm({ ...eventForm, type: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={eventForm.image_url}
                    onChange={e => setEventForm({ ...eventForm, image_url: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={eventForm.description}
                    onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none"
                    rows={3}
                    required
                  />
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Posting...
                      </>
                    ) : 'Post Project'}
                  </button>
                </form>
              </>
            )}

            {/* Donations Tab */}
            {activeTab === 'donations' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <th className="px-4 py-3 text-left rounded-tl-lg">ID</th>
                      <th className="px-4 py-3 text-left">Group</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left rounded-tr-lg">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((d, i) => (
                      <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3">{d.id}</td>
                        <td className="px-4 py-3">{d.group}</td>
                        <td className="px-4 py-3 capitalize">{d.type}</td>
                        <td className="px-4 py-3">
                          {d.type === 'money' ? `KES ${d.amount}` : d.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminPage;