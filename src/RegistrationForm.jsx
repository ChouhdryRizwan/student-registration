import React, { useState, useEffect } from 'react';
import { getCountryCallingCode } from 'libphonenumber-js';
import { universitiesByCountry } from './universities';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    lastQualification: '',
    mobileCode: '',
    mobileNumber: '',
    state: '',
    city: '',
    country: '',
    university: ''
  });

  const [locationData, setLocationData] = useState({
    country: '',
    city: '',
    state: '',
    mobileCode: ''
  });

  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    // Fetch user location data using GeoJS API
    fetch('https://get.geojs.io/v1/ip/geo.json')
      .then(response => response.json())
      .then(data => {
        const mobileCode = getCountryCallingCode(data.country_code);
        setLocationData({
          country: data.country,
          city: data.city,
          state: data.region,
          mobileCode: `+${mobileCode}`
        });

        // Set universities based on the country
        const countryUniversities = universitiesByCountry[data.country_code] || [];
        setUniversities(countryUniversities);
      })
      .catch(error => console.error('Error fetching location data:', error));
  }, []);

  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      country: locationData.country,
      city: locationData.city,
      state: locationData.state,
      mobileCode: locationData.mobileCode
    }));
  }, [locationData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Update universities when the country changes
    if (name === 'country') {
      const countryUniversities = universitiesByCountry[value] || [];
      setUniversities(countryUniversities);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Show success toast notification
    toast.success('Your request is submitted, you will be contacted shortly!');
     // Refresh the page
     setTimeout(() => {
        window.location.reload();
      }, 6000); // Delay to allow the toast to be visible
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
      <ToastContainer />
      <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-lg my-5">
        <h1 className="text-3xl font-bold mb-5 text-center text-gray-800">Student Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-600">Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Email</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Last Qualification</label>
            <input required type="text" name="lastQualification" value={formData.lastQualification} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Mobile Code</label>
            <input required type="text" name="mobileCode" value={formData.mobileCode} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Mobile Number</label>
            <input required type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">State/Province</label>
            <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">City</label>
            <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Country</label>
            <input required type="text" name="country" value={formData.country} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">University</label>
            <select required name="university" value={formData.university} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Select University</option>
              {universities.map((university, index) => (
                <option key={index} value={university}>{university}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
