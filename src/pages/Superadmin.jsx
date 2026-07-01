import React, { useEffect, useState } from 'react';
import SuperadminNavbar from '../components/SuperadminNavbar';

const BASE = 'https://connect-backend-8x61.onrender.com';

// ── Small reusable badge component ───────────────────────────────────────────
// Think of this like a label sticker on a file folder — it tells you at a
// glance what category or state something is in, using colour to convey
// meaning without making you read carefully.
const Badge = ({ value, color = 'gray' }) => {
  const colors = {
    gray:   'bg-gray-100 text-gray-600',
    green:  'bg-green-100 text-green-700',
    amber:  'bg-amber-100 text-amber-700',
    red:    'bg-red-100 text-red-700',
    blue:   'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[color] || colors.gray}`}>
      {value}
    </span>
  );
};

// ── Status badge for donation — maps status string to a meaningful colour ────
const StatusBadge = ({ status }) => {
  const map = {
    completed: { color: 'green',  label: 'Completed' },
    pending:   { color: 'amber',  label: 'Pending' },
    failed:    { color: 'red',    label: 'Failed' },
  };
  const { color, label } = map[status] || { color: 'gray', label: status || 'Unknown' };
  return <Badge value={label} color={color} />;
};

// ── Availability badge for volunteers ────────────────────────────────────────
const AvailabilityBadge = ({ value }) => {
  if (!value) return <span className="text-gray-400 text-xs">Not specified</span>;
  return <Badge value={value} color="purple" />;
};

export default function Superadmin() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers]         = useState([]);
  const [projects, setProjects]   = useState([]);
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]); // NEW
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${BASE}/users`,      { headers }).then(r => r.json()),
      fetch(`${BASE}/projects`,   { headers }).then(r => r.json()),
      fetch(`${BASE}/donations`,  { headers }).then(r => r.json()),
      fetch(`${BASE}/volunteers`, { headers }).then(r => r.json()), // NEW
    ])
      .then(([u, p, d, v]) => {
        setUsers(Array.isArray(u) ? u : []);
        setProjects(Array.isArray(p) ? p : []);
        setDonations(Array.isArray(d) ? d : []);
        setVolunteers(Array.isArray(v) ? v : []); // NEW
      })
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, [token]);

  // Helper — look up a project name by id, used by the donations and
  // volunteers tables to show the project type instead of a raw foreign key.
  const projectName = (id) => {
    if (!id) return <span className="text-gray-400">General Fund</span>;
    const project = projects.find((p) => p.id === id);
    return project ? project.type : <span className="text-gray-400">Unknown</span>;
  };

  // Tab config — single source of truth, so adding a new tab later is
  // just one more entry here rather than changes scattered everywhere.
  const tabs = [
    { key: 'users',      label: 'Users',      count: users.length,      icon: '👥' },
    { key: 'projects',   label: 'Projects',   count: projects.length,   icon: '📋' },
    { key: 'donations',  label: 'Donations',  count: donations.length,  icon: '💰' },
    { key: 'volunteers', label: 'Volunteers', count: volunteers.length, icon: '🤝' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <SuperadminNavbar />
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <SuperadminNavbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-white text-sm opacity-75 mb-8">
          Full visibility across users, projects, donations, and volunteers.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Tab buttons ── */}
        <div className="flex flex-wrap gap-3 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-purple-700 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab.key ? 'bg-purple-100 text-purple-700' : 'bg-white/30 text-white'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table card ── */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* ── USERS ── */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    {['ID', 'First Name', 'Last Name', 'Email', 'Role'].map((h) => (
                      <th key={h} className="px-6 py-4 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-10 text-gray-400">No users found.</td></tr>
                  ) : users.map((u, i) => (
                    <tr key={u.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-gray-500">{u.id}</td>
                      <td className="px-6 py-4 font-medium">{u.first_name}</td>
                      <td className="px-6 py-4">{u.last_name}</td>
                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <Badge value={u.role} color={u.role === 'admin' ? 'purple' : 'blue'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── PROJECTS ── */}
          {activeTab === 'projects' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    {['ID', 'Type', 'Date', 'Description', 'Target (KES)'].map((h) => (
                      <th key={h} className="px-6 py-4 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projects.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-10 text-gray-400">No projects found.</td></tr>
                  ) : projects.map((p, i) => (
                    <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-gray-500">{p.id}</td>
                      <td className="px-6 py-4 font-medium">{p.type}</td>
                      <td className="px-6 py-4 text-gray-500">{p.date}</td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{p.description}</td>
                      <td className="px-6 py-4">
                        {p.target_amount
                          ? <span className="font-semibold text-green-700">KES {p.target_amount.toLocaleString()}</span>
                          : <span className="text-gray-400">Not set</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── DONATIONS ──
              CHANGED: renamed "Group" column to "Project" since group now
              simply reflects the project type — showing "Nation Group" /
              "Camera Group" as a separate concept was confusing and no
              longer meaningful after the donation→project link was added.
              ADDED: Status column so admin can see pending vs completed. */}
          {activeTab === 'donations' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    {['ID', 'Project', 'Type', 'Amount (KES)', 'Status', 'Date', 'Details'].map((h) => (
                      <th key={h} className="px-6 py-4 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {donations.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-10 text-gray-400">No donations yet.</td></tr>
                  ) : donations.map((d, i) => (
                    <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-gray-500">{d.id}</td>
                      {/* Project — uses the real project name from project_id if available,
                          falls back to group for legacy donations that predated the link */}
                      <td className="px-6 py-4 font-medium">
                        {d.project_id
                          ? <span className="text-blue-700 font-semibold">{projectName(d.project_id)}</span>
                          : <span className="text-gray-400 text-xs">{d.group || 'General Fund'}</span>
                        }
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          value={d.type}
                          color={d.type === 'mpesa' ? 'green' : d.type === 'food' ? 'amber' : 'blue'}
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {d.amount ? `KES ${d.amount.toLocaleString()}` : '—'}
                      </td>
                      {/* NEW — status column, critical for tracking M-Pesa confirmation */}
                      <td className="px-6 py-4">
                        <StatusBadge status={d.status} />
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {d.date ? new Date(d.date).toLocaleDateString('en-KE') : '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{d.details || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── VOLUNTEERS ── NEW
              Think of this table as the coordinator's clipboard — everything
              they need to actually reach out to and organise volunteers,
              not just a count of how many signed up. */}
          {activeTab === 'volunteers' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    {['ID', 'Full Name', 'Email', 'Phone', 'Project', 'Availability', 'Skills', 'Signed Up'].map((h) => (
                      <th key={h} className="px-6 py-4 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {volunteers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-gray-400">
                        No volunteers yet.
                      </td>
                    </tr>
                  ) : volunteers.map((v, i) => (
                    <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-gray-500">{v.id}</td>
                      <td className="px-6 py-4 font-medium">
                        {v.full_name && v.full_name !== 'Not provided'
                          ? v.full_name
                          : <span className="text-gray-400 text-xs">Not provided</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{v.email}</td>
                      <td className="px-6 py-4">
                        {v.phone_number && v.phone_number !== 'Not provided'
                          ? <a href={`tel:${v.phone_number}`} className="text-blue-600 hover:underline">{v.phone_number}</a>
                          : <span className="text-gray-400 text-xs">Not provided</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-blue-700">
                          {projectName(v.event_id)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <AvailabilityBadge value={v.availability} />
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                        {v.skills || <span className="text-gray-400 text-xs">None listed</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {v.created_at
                          ? new Date(v.created_at).toLocaleDateString('en-KE')
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}