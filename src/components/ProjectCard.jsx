import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProjectCard({ project }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [volunteered, setVolunteered] = useState(false);

  useEffect(() => {
    if (user) {
      fetch(`http://127.0.0.1:5000/volunteers/check?user_id=${user.id}&event_id=${project.id}`)
        .then(res => res.json())
        .then(data => setVolunteered(data.volunteered));
    }
  }, [user, project.id]);

  const handleClick = () => {
    if (!user) return navigate("/login");
    
    const method = volunteered ? "DELETE" : "POST";
    fetch("http://127.0.0.1:5000/volunteers" + (volunteered ? `?user_id=${user.id}&event_id=${project.id}` : ""), {
      method,
      headers: { "Content-Type": "application/json" },
      body: !volunteered ? JSON.stringify({ user_id: user.id, event_id: project.id,email:user.email }) : null,
    })
      .then(res => res.ok && setVolunteered(!volunteered));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:scale-105 hover:shadow-2xl cursor-pointer border-2 transition-transform duration-300">
      <img src={project.image_url} alt={project.type} className="h-56 w-full object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold mb-3">{project.type}</h3>
        <h4 className="text-md mb-3">Starting: {new Date(project.date).toLocaleDateString()}</h4>
        <p className="text-gray-600 mb-4">{project.description}</p>
        <div className="flex justify-center space-x-4">
          <Link to="/donate" className="px-6 py-2 rounded-full bg-blue-700 text-white hover:bg-blue-800">Support</Link>
          <button onClick={handleClick} className={`px-6 py-2 rounded-full text-white ${volunteered ? "bg-red-600" : "bg-blue-700"}`}>
            {volunteered ? "Unvolunteer" : "Volunteer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
