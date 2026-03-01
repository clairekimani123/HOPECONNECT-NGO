import { Outlet } from "react-router"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import { useEffect, useState } from "react"

function App() { 
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/projects')
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