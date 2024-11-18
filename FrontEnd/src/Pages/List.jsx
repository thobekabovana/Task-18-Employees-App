import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function List() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async (employeeId) => {
      try {
        // Get the ID token for the current user
        const auth = getAuth();
        const idToken = await auth.currentUser.getIdToken();

        // Send request to fetch employees by employeeId
        const response = await axios.get(`http://localhost:3000/api/employees/${employeeId}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        // Verify that response is an array
        if (Array.isArray(response.data)) {
          setEmployees(response.data);
        } else {
          console.error('Expected an array of employees, but got:', response.data);
          setError('Unexpected response format');
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        if (error.response) {
          // Server responded with a status other than 200 range
          if (error.response.status === 404) {
            setError('No employees found for this employeeId.');
          } else {
            setError('Error fetching employees: ' + error.response.data.message);
          }
        } else {
          // Network error or other issues
          setError('Error fetching employees: ' + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    // Listen to auth state changes
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Assuming employeeId is part of the user profile or Firestore document
        // Fetch employees based on employeeId (user.uid or any employee-specific ID)
        const employeeId = user.uid; // Example: using UID as employeeId, adjust as needed
        fetchEmployees(employeeId); // Fetch data for the authenticated employee
      } else {
        setLoading(false);
        setError('User is not authenticated. Please log in.');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleView = (id) => {
    navigate(`/view/${id}`);
  };

  return (
    <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-black mb-6 text-center">Employees List</h2>

        {/* Loading State */}
        {loading && <p className="text-center text-gray-500">Loading...</p>}

        {/* Error State */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Employees List */}
        {!loading && !error && employees.length === 0 ? (
          <p className="text-center text-gray-500">No employees found.</p>
        ) : (
          employees.map((employee) => (
            <div key={employee.id} className="bg-white p-6 rounded-lg shadow-lg mb-4 w-full">
              <div className="flex items-center space-x-4">
                {/* Profile Picture */}
                {employee.profilePicture && (
                  <img
                    src={employee.profilePicture}
                    alt={`${employee.name} ${employee.surname}'s profile`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {employee.name} {employee.surname}
                  </h3>
                  <p className="text-gray-500">{employee.identityNumber}</p>
                </div>
                <button
                  className="bg-pink-600 text-white px-4 py-2 rounded shadow-md hover:bg-pink-700"
                  onClick={() => handleView(employee.id)}
                >
                  View
                </button>
              </div>
              <div className="w-full bg-pink-300 h-1 shadow-lg mt-4"></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
