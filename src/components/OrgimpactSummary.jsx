import React, { useState, useEffect } from 'react';

function formatKES(amount) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function OrgImpactSummary() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://connect-backend-8x61.onrender.com/projects/dashboard/overview')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setData(null));
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl py-6 px-4">
              <p className="text-2xl md:text-3xl font-bold text-blue-700">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OrgImpactSummary;