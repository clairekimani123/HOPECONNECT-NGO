import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function VolunteerPage() {
  const { projects, loadingProjects } = useOutletContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [volunteerStatus, setVolunteerStatus] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Check volunteer status for all projects when user is logged in
  useEffect(() => {
    if (!user || loadingProjects || projects.length === 0) return;

    projects.forEach(async (project) => {
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/volunteers/check?user_id=${user.id}&event_id=${project.id}`
        );
        const data = await res.json();
        setVolunteerStatus((prev) => ({ ...prev, [project.id]: data.volunteered }));
      } catch (err) {
        console.error('Error checking volunteer status:', err);
      }
    });
  }, [user, projects, loadingProjects]);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleVolunteer = async (project) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoadingId(project.id);

    try {
      if (volunteerStatus[project.id]) {
        const res = await fetch(
          `http://127.0.0.1:5000/volunteers?user_id=${user.id}&event_id=${project.id}`,
          { method: 'DELETE' }
        );
        if (res.ok) {
          setVolunteerStatus((prev) => ({ ...prev, [project.id]: false }));
          showMessage(`You have withdrawn from "${project.type}".`, 'info');
        } else {
          const data = await res.json();
          showMessage(data.error || 'Failed to unvolunteer.', 'error');
        }
      } else {
        const res = await fetch('http://127.0.0.1:5000/volunteers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            event_id: project.id,
            email: user.email,
          }),
        });
        if (res.ok) {
          setVolunteerStatus((prev) => ({ ...prev, [project.id]: true }));
          showMessage(`You signed up to volunteer for "${project.type}"! 🎉`, 'success');
        } else {
          const data = await res.json();
          showMessage(data.error || 'Failed to volunteer.', 'error');
        }
      }
    } catch (err) {
      showMessage('Something went wrong. Please try again.', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Volunteer With Us</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
          Join our community of changemakers. Pick a project below and sign up to make a difference today.
        </p>
        {!user && (
          <div className="mt-6 inline-block bg-white bg-opacity-20 border border-white border-opacity-40 rounded-xl px-6 py-3 text-white text-sm">
            💡 Please{' '}
            <button
              onClick={() => navigate('/login')}
              className="underline font-semibold hover:text-yellow-200"
            >
              sign in
            </button>{' '}
            to volunteer for a project
          </div>
        )}
      </section>

      {/* Notification Message */}
      {message.text && (
        <div className={`max-w-3xl mx-auto mt-6 px-4 py-3 rounded-lg text-center font-medium transition-all ${
          message.type === 'success'
            ? 'bg-green-100 border border-green-300 text-green-700'
            : message.type === 'error'
            ? 'bg-red-100 border border-red-300 text-red-700'
            : 'bg-blue-100 border border-blue-300 text-blue-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          Current Projects & Events
        </h2>

        {loadingProjects ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium text-lg">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <p className="text-xl">No projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const isVolunteered = volunteerStatus[project.id];
              const isLoading = loadingId === project.id;

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3" />

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {project.type}
                    </h3>
                    <p className="text-gray-500 text-sm flex-1 mb-6">
                      {project.description || 'Help us make an impact with this project.'}
                    </p>

                    {isVolunteered && (
                      <div className="mb-3 flex items-center gap-2 text-green-600 text-sm font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                        You're signed up for this project
                      </div>
                    )}

                    <button
                      onClick={() => handleVolunteer(project)}
                      disabled={isLoading}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed
                        ${isVolunteered
                          ? 'bg-red-50 border-2 border-red-300 text-red-600 hover:bg-red-100'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
                        }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : isVolunteered ? (
                        '✕ Withdraw Volunteer'
                      ) : !user ? (
                        '🔒 Sign In to Volunteer'
                      ) : (
                        '✋ Volunteer for this Project'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default VolunteerPage;