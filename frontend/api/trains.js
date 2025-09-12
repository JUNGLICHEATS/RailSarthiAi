import { trainData } from './data.js';

export default function handler(req, res) {
  try {
    res.status(200).json(trainData);
  } catch (error) {
    console.error('Error reading train data:', error);
    res.status(500).json({ error: error.message });
  }
}
