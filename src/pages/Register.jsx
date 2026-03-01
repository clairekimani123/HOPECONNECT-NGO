import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext';

function ProjectsPage() {
  const { projects, loadingProjects } = useOutletContext();
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [projectList, setProjectList] = useState([]);

  const token = localStorage.getItem('access_token');

  const [form, setForm] = useState({
    type: '',
    description: '',
    date: '',
    image_url: '',
  });

  // Sync projectList when projects from context loads/updates
  useEffect(() => {
    if (!loadingProjects) {
      setProjectList(projects);
    }
  }, [projects, loadingProjects]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://127.0.0.1:5000/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create project');
      }

      const newProject = await res.json();
      setProjectList((prev) => [...prev, newProject]);
      setForm({ type: '', description: '', date: '', image_url: '' });
      setSuccessMsg('Project added successfully! 🎉');
      setTimeout(() => {
        setSuccessMsg('');
        setShowModal(false);
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 pt-20 min-h-screen">
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">

          {/* Header */}
          <div className="relative mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
              Our Impact in Action
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              See how your contributions are creating tangible change. Here are our current projects and upcoming events.
            </p>

            {/* Only visible to admins */}
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-blue-700 hover:text-white transition-all duration-200"
              >
                <span className="text-xl font-bold">+</span> Add Project
              </button>
            )}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingProjects ? (
              <div className="col-span-full flex flex-col items-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                <p className="text-white font-medium text-lg">Loading projects...</p>
              </div>
            ) : projectList.length > 0 ? (
              projectList.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))
            ) : (
              <p className="text-white col-span-full text-lg">No projects found.</p>
            )}
          </div>

        </div>
      </section>

      {/* Add Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">

            <button
              onClick={() => { setShowModal(false); setErrorMsg(''); setSuccessMsg(''); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Project</h2>

            {successMsg && (
              <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4 text-center">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg mb-4 text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Type / Name</label>
                <input
                  type="text"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  placeholder="e.g. Health, Education"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                {form.image_url && (
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="mt-2 h-32 w-full object-cover rounded-lg border"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the project..."
                  rows={3}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding Project...
                  </>
                ) : (
                  'Add Project'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;