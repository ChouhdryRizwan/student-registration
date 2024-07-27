import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCountryCallingCode } from "libphonenumber-js";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

// Utility function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    lastQualification: "",
    mobilePhone: "",  // Changed to single mobilePhone field
    state: "",
    city: "",
    country: "",
  });

  const [locationData, setLocationData] = useState({
    country: "",
    city: "",
    state: "",
    mobileCode: "",
  });

  const [universities, setUniversities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user location data using GeoJS API
    fetch("https://get.geojs.io/v1/ip/geo.json")
      .then((response) => response.json())
      .then((data) => {
        const mobileCode = getCountryCallingCode(data.country_code);
        const formattedCountry = capitalizeFirstLetter(data.country);
        setLocationData({
          country: formattedCountry,
          city: capitalizeFirstLetter(data.city),
          state: capitalizeFirstLetter(data.region),
          mobileCode: `+${mobileCode}`,
        });

        // Fetch universities based on the country
        fetchUniversities(formattedCountry);
      })
      .catch((error) => console.error("Error fetching location data:", error));
  }, []);

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      country: locationData.country,
      city: locationData.city,
      state: locationData.state,
      mobilePhone: locationData.mobileCode,  // Set mobilePhone to the initial mobileCode
    }));
  }, [locationData]);

  const fetchUniversities = async (country) => {
    try {
      const response = await axios.get(
        `http://universities.hipolabs.com/search?country=${country}`
      );
      const universityNames = response.data.map(
        (university) => university.name
      );
      setUniversities(universityNames);
    } catch (error) {
      console.error("Error fetching universities:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobilePhone") {
      setFormData((prevState) => ({
        ...prevState,
        mobilePhone: value,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]:
          name === "country" || name === "city" || name === "state"
            ? capitalizeFirstLetter(value)
            : value,
      }));
    }

    // Update universities and reset fields when country changes
    if (name === "country") {
      fetchUniversities(capitalizeFirstLetter(value));
      setFormData((prevState) => ({
        ...prevState,
        city: "",
        state: "",
        mobilePhone: "",  // Reset mobilePhone
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Your request is submitted, you will be contacted shortly!");
    // Redirect to the new page with the selected country
    navigate(`/universities?country=${formData.country}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
      <ToastContainer />
      <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-lg my-5">
        <h1 className="text-3xl font-bold mb-5 text-center text-gray-800">
          University Finder
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <div>
            <label className="block mb-1 text-gray-600">Name</label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Email</label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">
              Last Qualification
            </label>
            <input
              required
              type="text"
              name="lastQualification"
              value={formData.lastQualification}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div> */}
          <div>
            <label className="block mb-1 text-gray-600">Country</label>
            <input
              required
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">State/Province</label>
            <input
              required
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">City</label>
            <input
              required
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Mobile Phone</label>
            <input
              required
              type="text"
              name="mobilePhone"
              value={formData.mobilePhone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="+1234567890"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
