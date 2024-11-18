// HeroSection.js
import React from 'react';

const Landing = () => {
  return (
    <section className="bg-white h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="text-center z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-pink-300 mb-4">
          Welcome to Mannings Employees
        </h1>
        <p className="text-lg md:text-2xl text-pink-200 mb-8">
          Find it easy to register Employees and get them
        </p>
        <button className="bg-pink-500 text-white px-8 py-3 rounded hover:bg-pink-700 transition duration-300">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Landing;
