// api/universities.js
const axios = require('axios');

export default async function handler(req, res) {
  const { country } = req.query;

  try {
    const response = await axios.get(`http://universities.hipolabs.com/search?country=${country}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching universities' });
  }
}
