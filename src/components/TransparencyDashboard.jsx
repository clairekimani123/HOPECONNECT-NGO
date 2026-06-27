import React, { useState, useEffect, useRef } from 'react';

const CATEGORY_COLORS = {
  materials: 'bg-amber-500',
  labor: 'bg-blue-500',
  logistics: 'bg-purple-500',
  permits: 'bg-pink-500',
  other: 'bg-gray-400',
};

function formatKES(amount) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function TransparencyDashboard({ projectId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const pollRef = useRef(null);

  const fetchDashboard = () => {
    fetch(`https://connect-backend-8x61.onrender.com/projects/${projectId}/dashboard`)
      .then((res) => {
        if (!res.ok) throw new Error('Could not load dashboard data');
        return res.json();
      })
      .then((json) => { setData(json); setError(''); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();

    // Poll every 8s while this dashboard is open. This is what makes a
    // donation that just got confirmed via M-Pesa actually show up here
    // without the donor needing to manually refresh the whole page.
    pollRef.current = setInterval(fetchDashboard, 8000);
    return () => clearInterval(pollRef.current);
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">
        Transparency data is not available for this project yet.
      </p>
    );
  }

  const breakdownEntries = Object.entries(data.expense_breakdown || {});
  const totalExpenses = breakdownEntries.reduce((sum, [, amt]) => sum + amt, 0);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Where the money goes</h3>
        <span className="text-[10px] text-gray-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />
          Live
        </span>
      </div>

      {data.target > 0 && (
        <div className="mb-5">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{formatKES(data.raised)} raised</span>
            <span>{data.percent_funded}% of {formatKES(data.target)} goal</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${data.percent_funded}%` }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-5 text-center">
        <div className="bg-blue-50 rounded-lg py-3">
          <p className="text-xs text-gray-500 mb-1">Raised</p>
          <p className="text-base font-bold text-blue-700">{formatKES(data.raised)}</p>
        </div>
        <div className="bg-amber-50 rounded-lg py-3">
          <p className="text-xs text-gray-500 mb-1">Spent</p>
          <p className="text-base font-bold text-amber-700">{formatKES(data.spent)}</p>
        </div>
        <div className="bg-green-50 rounded-lg py-3">
          <p className="text-xs text-gray-500 mb-1">Remaining</p>
          <p className="text-base font-bold text-green-700">{formatKES(data.remaining)}</p>
        </div>
      </div>

      {breakdownEntries.length > 0 ? (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Spending breakdown</p>
          <div className="space-y-2">
            {breakdownEntries.map(([category, amount]) => {
              const pct = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
              return (
                <div key={category}>
                  <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                    <span className="capitalize">{category}</span>
                    <span>{formatKES(amount)} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className={`${CATEGORY_COLORS[category] || CATEGORY_COLORS.other} h-2 rounded-full`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-400 text-center">No expenses logged yet for this project.</p>
      )}

      <p className="text-xs text-gray-400 text-center mt-4">
        {data.donor_count} {data.donor_count === 1 ? 'donor has' : 'donors have'} contributed to this project
        {data.pending_donations > 0 && (
          <span className="block mt-1 text-amber-500">
            {data.pending_donations} payment{data.pending_donations > 1 ? 's' : ''} awaiting confirmation
          </span>
        )}
      </p>
    </div>
  );
}

export default TransparencyDashboard;