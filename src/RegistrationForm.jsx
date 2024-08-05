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
    mobilePhone: "",
    state: "",
    city: "",
    country: "",
    phoneCode: "",  // Add phoneCode to formData
  });

  const [locationData, setLocationData] = useState({
    country: "",
    city: "",
    state: "",
    mobileCode: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  const apiToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJtdWhhbW1hZHJpendhbnRhaGlyMjNAZ21haWwuY29tIiwiYXBpX3Rva2VuIjoiQ2lER3I2czBDZHdnVWxGMEVNcjMydDQtV2tIRjNHZ0Y0RGJaa2wyZ3Q0RmhzRDFwaENyN1VUZDBRUEdVbXRyUVRVMCJ9LCJleHAiOjE3MjI5Njg2ODR9.E2Lg3C1PZQdSDZMNP7w6NKjUIytHj84q-jXUSY6RtWI";

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
      })
      .catch((error) => console.error("Error fetching location data:", error));
  }, []);

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      country: locationData.country,
      city: locationData.city,
      state: locationData.state,
      mobilePhone: locationData.mobileCode,
    }));
  }, [locationData]);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        `https://www.universal-tutorial.com/api/countries/`,
        {
          headers: { Authorization: `Bearer ${apiToken}` },
        }
      );
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async (country) => {
    try {
      const response = await axios.get(
        `https://www.universal-tutorial.com/api/states/${country}`,
        {
          headers: { Authorization: `Bearer ${apiToken}` },
        }
      );
      setStates(response.data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (state) => {
    try {
      const response = await axios.get(
        `https://www.universal-tutorial.com/api/cities/${state}`,
        {
          headers: { Authorization: `Bearer ${apiToken}` },
        }
      );
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "country") {
      const selectedCountry = countries.find(
        (country) => country.country_name.toLowerCase() === value.toLowerCase()
      );
      if (selectedCountry) {
        setFormData((prevState) => ({
          ...prevState,
          phoneCode: `+${selectedCountry.country_phone_code}`,
          state: "",
          city: "",
          mobilePhone: `+${selectedCountry.country_phone_code}`, // Update mobilePhone with new phoneCode
        }));
        fetchStates(selectedCountry.country_name);
      }
    } else if (name === "state") {
      fetchCities(value);
      setFormData((prevState) => ({
        ...prevState,
        city: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isCountryValid = countries.some(
      (country) =>
        country.country_name.toLowerCase() === formData.country.toLowerCase()
    );
    const isStateValid = states.some(
      (state) => state.state_name.toLowerCase() === formData.state.toLowerCase()
    );
    const isCityValid = cities.some(
      (city) => city.city_name.toLowerCase() === formData.city.toLowerCase()
    );
    if (!isCountryValid) {
      alert("Please select a valid country from the list.");
      return;
    }
    if (!isStateValid) {
      alert("Please select a valid state from the list.");
      return;
    }
    if (!isCityValid) {
      alert("Please select a valid city from the list.");
      return;
    }

    // toast.success("Your request is submitted, you will be contacted shortly!");
    navigate(`/universities?country=${formData.country}`);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
      <ToastContainer />
      <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-lg my-5">
        <h1 className="text-3xl font-bold mb-5 text-center text-gray-800">
          University Finder
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-600">Country</label>
            <input
              required
              type="text"
              list="countries"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <datalist id="countries">
              {countries.map((country) => (
                <option
                  key={country.country_name}
                  value={country.country_name}
                />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block mb-1 text-gray-600">State/Province</label>
            <input
              required
              type="text"
              list="states"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <datalist id="states">
              {states.map((state) => (
                <option key={state.state_name} value={state.state_name} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block mb-1 text-gray-600">City</label>
            <input
              required
              type="text"
              list="cities"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <datalist id="cities">
              {cities.map((city) => (
                <option key={city.city_name} value={city.city_name} />
              ))}
            </datalist>
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
