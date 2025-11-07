import express from 'express';
import cors from 'cors';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();

// Load from .env
const PORT = process.env.PORT || 5000;
const DATA_FILE = process.env.DATA_FILE || 'whiteboardData.json';

app.use(cors());
app.use(express.json());

// Define Element interface
interface Element {
  id: string;
  type: 'line' | 'rectangle' | 'circle' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  color: string;
  strokeWidth: number;
}

interface WhiteboardState {
  elements: Element[];
}

// Load saved state from file or initialize empty
let whiteboardState: WhiteboardState = { elements: [] };

const dataPath = path.resolve(DATA_FILE);

// Read from JSON file if it exists
if (fs.existsSync(dataPath)) {
  try {
    const data = fs.readFileSync(dataPath, 'utf-8');
    whiteboardState = JSON.parse(data);
    console.log('Loaded whiteboard data from file.');
  } catch (err) {
    console.error('Failed to read JSON data:', err);
  }
}

// Save to file helper
const saveToFile = () => {
  fs.writeFileSync(dataPath, JSON.stringify(whiteboardState, null, 2));
};

// GET current state
app.get('/api/whiteboard', (req, res) => {
  res.json(whiteboardState);
});

// POST new state
app.post('/api/whiteboard', (req, res) => {
  whiteboardState = req.body;
  saveToFile();
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
