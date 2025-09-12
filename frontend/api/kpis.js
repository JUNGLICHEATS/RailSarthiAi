import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export default function handler(req, res) {
  try {
    // Read CSV file from public directory
    const csvPath = path.join(process.cwd(),'data', 'train_data.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    
    // Parse CSV
    const trains = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    // Calculate KPIs
    const total = trains.length;
    const onTime = trains.filter((t) => (t.Disruption || '').toLowerCase() === 'none').length;
    const punctuality = total ? Number(((onTime / total) * 100).toFixed(1)) : 0;
    const underMaintenance = trains.filter((t) => (t.TrackStatus || '').includes('maintenance')).length;
    const occupancyAvg = trains.reduce((acc, t) => acc + (Number(t.PassengerLoad) || 0), 0) / (total || 1);
    
    // Calculate additional KPIs for the new dashboard
    const avgSpeed = 70; // kmph - you can calculate this from actual data if available
    const totalDwell = trains.reduce((acc, t) => acc + (Number(t.DwellTimeMinutes) || 0), 0) / 60; // Convert to hours
    const totalThroughput = total; // Total number of trains
    
    res.status(200).json({ 
      totalTrains: total, 
      punctuality, 
      maintenanceTrains: underMaintenance, 
      avgPassengerLoad: Number(occupancyAvg.toFixed(2)),
      avgTrainSpeed: avgSpeed,
      totalDwell: Number(totalDwell.toFixed(0)),
      totalThroughput: totalThroughput
    });
  } catch (error) {
    console.error('Error calculating KPIs:', error);
    res.status(500).json({ error: error.message });
  }
}
