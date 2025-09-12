import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export default function handler(req, res) {
  try {
    // Try multiple possible paths for Vercel deployment
    const possiblePaths = [
      path.join(process.cwd(), 'data', 'train_data.csv'),
      path.join(process.cwd(), 'public', 'data', 'train_data.csv'),
      path.join(process.cwd(), '..', 'data', 'train_data.csv'),
      path.join(process.cwd(), '..', 'public', 'data', 'train_data.csv'),
      path.join(process.cwd(), '..', '..', 'public', 'data', 'train_data.csv')
    ];
    
    let csvContent = null;
    let csvPath = null;
    
    // Try each possible path
    for (const testPath of possiblePaths) {
      try {
        if (fs.existsSync(testPath)) {
          csvContent = fs.readFileSync(testPath, 'utf8');
          csvPath = testPath;
          break;
        }
      } catch (err) {
        // Continue to next path
        continue;
      }
    }
    
    if (!csvContent) {
      throw new Error('Could not find train_data.csv in any expected location');
    }
    
    // Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    console.log(`Successfully loaded ${records.length} train records from ${csvPath}`);
    res.status(200).json(records);
  } catch (error) {
    console.error('Error reading train data:', error);
    res.status(500).json({ error: error.message });
  }
}
