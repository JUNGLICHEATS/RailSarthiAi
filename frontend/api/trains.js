import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export default function handler(req, res) {
  try {
    // Try multiple possible locations for the CSV file
    const possiblePaths = [
      path.join(process.cwd(), 'data', 'train_data.csv'),
      path.join(process.cwd(), 'public', 'data', 'train_data.csv'),
      path.join(process.cwd(), 'frontend', 'data', 'train_data.csv'),
      path.join(process.cwd(), 'frontend', 'public', 'data', 'train_data.csv')
    ];
    
    let csvContent = null;
    let csvPath = null;
    
    for (const testPath of possiblePaths) {
      try {
        csvContent = fs.readFileSync(testPath, 'utf8');
        csvPath = testPath;
        break;
      } catch (err) {
        // Continue to next path
      }
    }
    
    if (!csvContent) {
      console.error('Available paths tried:', possiblePaths);
      console.error('Current working directory:', process.cwd());
      throw new Error('Could not find train_data.csv in any expected location');
    }
    
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
