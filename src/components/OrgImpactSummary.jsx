import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function formatKES(amount) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function OrgImpactSummary() {
  const [data, setData] = useState(null);

  const fetchOverview = () => {
    fetch('https://connect-backend-8x61.onrender.com/projects/dashboard/overview')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setData(null));
  };

  useEffect(() => {
    fetchOverview();
    // Poll every 10s so this section stays live too — same pattern as
    // the per-project TransparencyDashboard, just on a slightly longer
    // interval since this is a summary view, not an active payment flow.
    const interval = setInterval(fetchOverview, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return null;

  const stats = [
    { label: 'Total raised', value: formatKES(data.total_raised) },
    { label: 'Total spent transparently', value: formatKES(data.total_spent) },
    { label: 'Donors', value: data.donor_count },
    { label: 'Active projects', value: data.project_count },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Full transparency, always</h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Every shilling donated is tracked. Here's exactly what's been raised and spent across all our projects.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl py-6 px-4">
              <p className="text-2xl md:text-3xl font-bold text-blue-700">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* NEW — per-project breakdown, so a donor can see at a glance
            where money is going before clicking into any single project */}
        {data.projects && data.projects.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-left">Raised by project</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.projects.map((project) => (
                <Link
                  key={project.project_id}
                  to="/projects"
                  className="block text-left bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-800 group-hover:text-blue-700 transition">
                      {project.project_type}
                    </h4>
                    {project.pending_donations > 0 && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        {project.pending_donations} pending
                      </span>
                    )}
                  </div>

                  <p className="text-2xl font-bold text-blue-700 mb-1">
                    {formatKES(project.raised)}
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    {project.donor_count} {project.donor_count === 1 ? 'donor' : 'donors'} · {formatKES(project.spent)} spent
                  </p>

                  {project.target > 0 && (
                    <div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mb-1">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full"
                          style={{ width: `${project.percent_funded}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-gray-400">
                        {project.percent_funded}% of {formatKES(project.target)} goal
                      </p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default OrgImpactSummary;