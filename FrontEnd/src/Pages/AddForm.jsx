import { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firestore instance
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export default function AddForm() { // Removed companyId prop
  const [inputs, setInputs] = useState({
    name: '',
    surname: '',
    email: '',
    number: '',
    position: '',
    employeeId: '', // Renamed to avoid conflict with the 'id' keyword
    profilePicture: null, // To store the Base64-encoded profile picture
  });
  const [notification, setNotification] = useState({
    type: '', // 'success' or 'error'
    message: '',
  });

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value
    }));
  };

  // Convert image file to Base64
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputs((prevInputs) => ({
          ...prevInputs,
          profilePicture: reader.result // Save the Base64-encoded image
        }));
      };
      reader.readAsDataURL(file); // Read file as Data URL (Base64)
    }
  };

  // Check if employee ID already exists
  const checkEmployeeIdExists = async (employeeId) => {
    const employeesCollection = collection(db, 'employees');
    const q = query(employeesCollection, where('employeeId', '==', employeeId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Returns true if employeeId exists
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if required fields are filled
    if (!inputs.name || !inputs.surname || !inputs.email || !inputs.number || !inputs.position || !inputs.employeeId) {
      setNotification({
        type: 'error',
        message: 'All fields are required.',
      });
      return;
    }

    // Check if employee ID already exists
    const employeeIdExists = await checkEmployeeIdExists(inputs.employeeId);
    if (employeeIdExists) {
      setNotification({
        type: 'error',
        message: 'Employee ID is already taken. Please choose a different ID.',
      });
      return;
    }

    try {
      // Employee data without companyId
      const employeeData = {
        ...inputs,
        createdAt: new Date(), // Add a timestamp if needed
      };

      // Save employee data to Firestore with Base64-encoded profile picture
      const employeesCollection = collection(db, 'employees');
      const newEmployeeRef = await addDoc(employeesCollection, employeeData);

      // If the employee is successfully added
      setNotification({
        type: 'success',
        message: `Employee added with ID: ${newEmployeeRef.id}`,
      });

      console.log('Employee added with ID:', newEmployeeRef.id);
    } catch (error) {
      // If there is an error while adding the employee
      setNotification({
        type: 'error',
        message: `Error adding employee: ${error.message}`,
      });

      console.error('Error adding employee:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-24 pb-24"> {/* Added padding to top and bottom */}
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-black text-center mb-8">Employee's Application</h1>
        
        {/* Notification Message */}
        {notification.message && (
          <div
            className={`p-3 mb-4 text-white text-center rounded-md ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {notification.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {['name', 'surname', 'email', 'number', 'position', 'employeeId'].map((field) => (
            <div key={field} className="relative">
              <label htmlFor={field} className="block text-gray-700">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type="text"
                id={field}
                name={field}
                placeholder={field === 'employeeId' ? 'Employee ID' : field.charAt(0).toUpperCase() + field.slice(1)}
                value={inputs[field]}
                onChange={handleChange}
                className="w-full p-3 border-b-2 border-l-2 border-pink-500 bg-transparent focus:outline-none focus:border-pink-700 shadow-sm placeholder-gray-500"
              />
            </div>
          ))}
          
          {/* Profile picture upload input */}
          <div className="relative">
            <label htmlFor="profilePicture" className="block text-gray-700">Profile Picture</label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border-b-2 border-l-2 border-pink-500 bg-transparent focus:outline-none focus:border-pink-700 shadow-sm"
            />
            {inputs.profilePicture && (
              <img
                src={inputs.profilePicture}
                alt="Profile"
                className="mt-2 w-20 h-20 rounded-full object-cover"
              />
            )}
          </div>
          
          <button
            type="submit"
            className="w-full p-3 bg-pink-700 text-white font-semibold rounded-lg hover:bg-pink-800 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
