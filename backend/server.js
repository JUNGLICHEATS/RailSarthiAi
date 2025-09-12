require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const { parse } = require('csv-parse');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const DATA_DIR = path.join(__dirname, 'data');

function readCsv(fileName) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(DATA_DIR, fileName);
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }))
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', (err) => reject(err));
  });
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'RailSarthiAi API' });
});

app.get('/api/trains', async (_req, res) => {
  try {
    const trains = await readCsv('train_data.csv');
    res.json(trains);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/platforms', async (_req, res) => {
  try {
    const platforms = await readCsv('platform_track_data.csv');
    res.json(platforms);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// KPIs for dashboard
app.get('/api/kpis', async (_req, res) => {
  try {
    const trains = await readCsv('train_data.csv');
    const total = trains.length;
    const onTime = trains.filter((t) => (t.Disruption || '').toLowerCase() === 'none').length;
    const punctuality = total ? Number(((onTime / total) * 100).toFixed(1)) : 0;
    const underMaintenance = trains.filter((t) => (t.TrackStatus || '').includes('maintenance')).length;
    const occupancyAvg = trains.reduce((acc, t) => acc + (Number(t.PassengerLoad) || 0), 0) / (total || 1);

    res.json({ totalTrains: total, punctuality, maintenanceTrains: underMaintenance, avgPassengerLoad: Number(occupancyAvg.toFixed(2)) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Allow frontend to serve built files if needed
app.use('/public', express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`RailSarthiAi API running on http://localhost:${PORT}`);
});


