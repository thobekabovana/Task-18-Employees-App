import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function ViewEmployee() {
  const { employeeId } = useParams(); // Get the employee ID from the URL (changed from 'id' to 'employeeId')
  const navigate = useNavigate(); // For redirecting after deletion
  const [employee, setEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
  const [inputs, setInputs] = useState({
    name: '',
    surname: '',
    email: '',
    number: '',
    position: '',
    profilePicture: '' // Add profilePicture for modal input
  });

  // Fetch employee details by employeeId
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/employees/${employeeId}`);
        setEmployee(response.data);
        setInputs({
          name: response.data.name,
          surname: response.data.surname,
          email: response.data.email,
          number: response.data.number,
          position: response.data.position,
          profilePicture: response.data.profilePicture || '' // Fetch profile picture URL
        });
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };

    fetchEmployee();
  }, [employeeId]); // Re-fetch when employeeId changes

  // Handle input changes for update form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/employees/${employeeId}`, inputs);
      setIsModalOpen(false); // Close the modal after update
      setEmployee({ ...employee, ...inputs }); // Update employee state with new values
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  // Handle employee deletion
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/employees/${employeeId}`);
      navigate('/employees'); // Redirect to employees list page after deletion
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  if (!employee) return <div>Loading...</div>; // Show loading while employee data is being fetched

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen pt-[60px] pb-[60px]"> {/* Adjust for navbar and footer height */}
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Employee Details</h2>

        {/* Profile Picture */}
        {employee.profilePicture && (
          <img
            src={employee.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-pink-600"
          />
        )}

        <div className="space-y-4">
          <div className="text-lg font-semibold text-gray-800">
            <span className="font-bold">Name: </span>{employee.name}
          </div>
          <div className="text-lg font-semibold text-gray-800">
            <span className="font-bold">Surname: </span>{employee.surname}
          </div>
          <div className="text-lg text-gray-600">
            <span className="font-bold">ID: </span>{employee.id}
          </div>
          <div className="text-lg text-gray-600">
            <span className="font-bold">Email: </span>{employee.email}
          </div>
          <div className="text-lg text-gray-600">
            <span className="font-bold">Phone: </span>{employee.number}
          </div>
          <div className="text-lg text-gray-600">
            <span className="font-bold">Position: </span>{employee.position}
          </div>
        </div>

        <div className="mt-8 flex justify-between space-x-4">
          <button
            className="bg-pink-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-pink-700 transition-colors w-full md:w-auto"
            onClick={() => setIsModalOpen(true)}
          >
            Update
          </button>
          <button
            className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors w-full md:w-auto"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg">
            <h1 className="text-3xl font-bold text-black text-center mb-8">Update Employee</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {['name', 'surname', 'email', 'number', 'position'].map((field) => (
                <div key={field} className="flex flex-col">
                  <label htmlFor={field} className="text-lg font-semibold text-gray-700 mb-2">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={inputs[field]}
                    onChange={handleChange}
                    className="w-full p-3 border-b-2 border-l-2 border-pink-500 bg-transparent focus:outline-none focus:border-pink-700 shadow-sm placeholder-gray-500"
                  />
                </div>
              ))}

              {/* File upload input for profile picture */}
              <div className="flex flex-col">
                <label htmlFor="profilePicture" className="text-lg font-semibold text-gray-700 mb-2">
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e)}
                  className="w-full p-3 border-b-2 border-l-2 border-pink-500 bg-transparent focus:outline-none focus:border-pink-700 shadow-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full p-3 bg-pink-700 text-white font-semibold rounded-lg hover:bg-pink-800 transition-colors"
              >
                Submit Changes
              </button>
            </form>
            <button
              onClick={() => setIsModalOpen(false)} // Close modal
              className="mt-4 w-full p-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
