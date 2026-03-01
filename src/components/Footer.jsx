import { Link } from 'react-router-dom';

function Footer(){
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              HOPE CONNECT
            </h3>
            <p className="text-gray-300 mb-6 text-lg">Bridging hearts, building futures.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/projects" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link 
                  to="/volunteer" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline"
                >
                  Volunteer
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Hope Connect. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;