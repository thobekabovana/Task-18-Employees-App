import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firestore } from '../firebase'; // Import firestore from firebase.js
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions

function LogInPg() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const auth = getAuth();

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userRole = await getUserRole(user.uid);

      // Store role and token in localStorage/sessionStorage for persistence
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('authToken', await user.getIdToken());

      // Redirect based on the user role
      if (userRole === 'super-admin' || userRole === 'general-admin') {
        navigate('/dashboard');
      } else {
        navigate('/addForm');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserRole = async (uid) => {
    // Fetch the user role from Firestore using the user UID
    const docRef = doc(firestore, 'users', uid); // Firestore document reference
    const docSnap = await getDoc(docRef); // Get the document snapshot

    if (docSnap.exists()) {
      return docSnap.data().role; // Assuming 'role' is stored in Firestore
    } else {
      throw new Error('User role not found');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="container max-w-md p-8 bg-white shadow-md rounded-lg mt-20 mb-20">
        <h2 className="text-3xl font-bold mb-4 text-center text-pink-500">Log In</h2>
        <form onSubmit={handleSubmit}>
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
              required
            />
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
              required
            />
          </div>

          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="mt-4 text-center">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-600 underline"
            >
              Click here
            </button>
          </p>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LogInPg;
