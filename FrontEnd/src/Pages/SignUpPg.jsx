import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyNumber, setCompanyNumber] = useState('');
  const [role, setRole] = useState('user'); // Default to 'user' role
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Using the hook to get navigation function

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !email || !password || !companyName || !companyNumber || !role) {
      alert('Please fill in all fields');
      return;
    }
  
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, companyName, companyNumber, role }), // Include role and company info
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
      } else {
        const data = await response.json();
        console.log('Registration successful:', data);
        navigate('/addForm'); // Redirect to the next page
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="container max-w-md p-8 bg-white shadow-md rounded-lg mt-20 mb-20">
        <h1 className="text-3xl font-bold mb-4 text-center text-pink-500">Sign Up</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
              Name and Surname
            </label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="companyName" className="block text-gray-700 font-bold mb-2">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="number" className="block text-gray-700 font-bold mb-2">
              Company Registration Number
            </label>
            <input
              type="text"
              id="number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
              value={companyNumber}
              onChange={(e) => setCompanyNumber(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700 font-bold mb-2">
              Role
            </label>
            <select
              id="role"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="general-admin">General Admin</option>
              <option value="super-admin">Super Admin</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded w-full"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>

          <p className="mt-4 text-center">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/logIn')} 
              className="text-blue-600 underline">
              Click here
            </button>
          </p>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Register;
