import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function HomePage(){
  const navigate = useNavigate()
  const user = localStorage.getItem("user")

  if (!user) {
    navigate("/login")
  }
  return (
    <div>
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            HOPE CONNECT
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto mb-8 leading-relaxed">
            Bridging hearts, building futures. We connect generosity with need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/donate" 
              className="bg-white border-2 border-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg 
              hover:bg-transparent hover:border-white hover:text-white 
              transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Donate Now
            </Link>
            <Link 
              to="/volunteer" 
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold text-lg 
              hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-600 hover:border-white hover:text-white hover:
              transition-all duration-700 shadow-lg hover:shadow-xl"
            >
              Volunteer
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 mb-6">
            Our Mission
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            It takes a village ~ be part of it!!
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto mt-6 leading-relaxed">
            We believe that every act of kindness creates a ripple effect that can transform lives. 
            Join our community of changemakers and help us build a world where no one is left behind.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Impact So Far
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Together, we've made a real difference in the lives of those who need it most.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-lg">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">2,500+</div>
              <div className="text-gray-700 font-medium">Lives Touched</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 hover:shadow-lg">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">150+</div>
              <div className="text-gray-700 font-medium">Active Volunteers</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">10+</div>
              <div className="text-gray-700 font-medium">Ongoing Projects</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Your contribution, whether big or small, can change someone's life forever. 
            Join us in creating hope and building brighter futures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/projects" 
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View Projects
            </Link>
            <Link 
              to="/about" 
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
