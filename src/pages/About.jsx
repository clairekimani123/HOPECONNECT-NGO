import React from 'react';
import { FaHeart, FaHandsHelping, FaBullseye } from 'react-icons/fa';

function AboutPage(){
  return (
    <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 pt-20">

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-gray-900">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            A Commitment to Humanity
          </p>
        </div>
      </section>

      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                alt="Hope Connect Team" 
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                From a Simple Idea to a Global Movement
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Hope Connect was born from a simple yet powerful idea: that no one should feel helpless or alone. 
                We saw the gaps in support for refugees, orphans, and those affected by war and knew that 
                technology and compassion could bridge them.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform was created to be more than just a website; it's a dynamic hub for connection, 
                a lifeline for those in need, and a clear path for those who wish to give. We empower local 
                heroes and global supporters to come together and create real, lasting change.
              </p>
            </div>

          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 cursor-pointer">
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl">
              <div className="flex justify-center mb-6 ">
                <div className="p-4 bg-gradient-to-br from-red-100 to-pink-100 rounded-full">
                  <FaHeart className="text-3xl text-red-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Compassion</h3>
              <p className="text-gray-600 leading-relaxed">
                We lead with empathy, ensuring every action is rooted in kindness and understanding 
                for the people we serve.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
                  <FaHandsHelping className="text-3xl text-blue-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Connection</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe in the power of community. We bridge the gap between those who need help 
                and those who can provide it.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-green-100 to-yellow-100 rounded-full">
                  <FaBullseye className="text-3xl text-green-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Impact</h3>
              <p className="text-gray-600 leading-relaxed">
                We are committed to delivering tangible results, ensuring that every donation 
                and volunteer hour creates a positive impact.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
