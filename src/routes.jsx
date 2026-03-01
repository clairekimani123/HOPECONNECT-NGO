import App from "./App";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import DonatePage from "./pages/Donate";
import HomePage from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/Projects";
import RegisterPage from "./pages/Register";
import SuperAdminPage from "./pages/Superadmin";
import VolunteerPage from './pages/VolunteerPage'

// Add this inside your routes:

import ProtectedRoute from "./components/ProtectedRoute";
import SuperAdminRoute from "./components/SuperadminRoute";

const routes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/admin",
    element: (
      <SuperAdminRoute>
        <SuperAdminPage />
      </SuperAdminRoute>
    ),
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/projects",
        element: <ProjectsPage />,
      },
      { path: '/volunteer',
        element: <VolunteerPage /> 
      },
      {
        path: "/donate",
        element: (
          <ProtectedRoute>
            <DonatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
    ],
  },
];

export default routes;