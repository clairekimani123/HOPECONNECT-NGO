import { Outlet, useLocation } from "react-router"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import { useEffect, useState } from "react"
import { initGA, trackPageView } from "./analytics"

function App() { 
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const location = useLocation(); // 👈 tracks current URL

  // ✅ Initialize GA once when app first loads
  useEffect(() => {
    initGA();
  }, []);

  // ✅ Track page view every time the route changes
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  useEffect(() => {
    fetch('https://connect-backend-8x61.onrender.com/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoadingProjects(false);
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
        setLoadingProjects(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Outlet context={{ projects, loadingProjects }} />
      </main>
      <Footer />
    </>
  )
}

export default App