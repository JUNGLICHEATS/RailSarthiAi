import { platformData } from './data.js';

export default function handler(req, res) {
  try {
    res.status(200).json(platformData);
  } catch (error) {
    console.error('Error reading platform data:', error);
    res.status(500).json({ error: error.message });
  }
}
