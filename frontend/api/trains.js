import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export default function handler(req, res) {
  try {
    // Read CSV file from public directory
    const csvPath = path.join(process.cwd(), 'public', 'data', 'train_data.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    
    // Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    res.status(200).json(records);
  } catch (error) {
    console.error('Error reading train data:', error);
    res.status(500).json({ error: error.message });
  }
}
