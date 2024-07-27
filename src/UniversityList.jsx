import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const UniversityList = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const country = queryParams.get("country");

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://universities.hipolabs.com/search?country=${country}`
        );
        setUniversities(response.data.map((uni) => uni.name));
        setLoading(false);
      } catch (err) {
        setError("Error fetching universities. Please try again later.");
        setLoading(false);
      }
    };

    if (country) {
      fetchUniversities();
    }
  }, [country]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg my-5">
        <h1 className="text-3xl font-bold mb-5 text-center text-gray-800">
          Universities in {country}
        </h1>
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <ul className="space-y-4">
            {universities.length > 0 ? (
              universities.map((university, index) => (
                <li key={index} className="p-4 border border-gray-300 rounded">
                  {university}
                </li>
              ))
            ) : (
              <p className="text-center text-gray-600">No universities found.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UniversityList;
