// api/universities.js

export default async function handler(req, res) {
    const { country } = req.query;
    try {
      const response = await fetch(`https://universities.hipolabs.com/search?country=${country}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching universities:', error);
      res.status(500).json({ message: 'Error fetching universities. Please try again later.' });
    }
  }
  