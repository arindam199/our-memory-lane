/**
 * OUR MEMORY LANE 📸 — Node.js Backend Server
 * Dedicated to Anvesha 💖
 * 
 * Provides static file serving and persistent REST APIs for:
 * - Custom uploaded polaroids & photos
 * - Edited captions, handwritten notes, and story chapters
 * - Bucket list additions, checks, and removals
 * - Secret promises & centerpiece photo
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = __dirname;
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure data folder and db.json exist
function ensureDb() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      polaroids: [],
      editedExistingPolaroids: {},
      stories: {},
      bucketList: [],
      promises: [],
      centerpiece: null,
      anniversary: "2024-04-22",
      updatedAt: Date.now()
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

function readDb() {
  ensureDb();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, returning empty defaults', err);
    return {
      polaroids: [],
      editedExistingPolaroids: {},
      stories: {},
      bucketList: [],
      promises: [],
      centerpiece: null,
      anniversary: "2024-04-22",
      updatedAt: Date.now()
    };
  }
}

function writeDb(data) {
  ensureDb();
  data.updatedAt = Date.now();
  const tmpFile = DB_FILE + '.tmp';
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
}

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function sendCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJson(res, statusCode, data) {
  sendCors(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

// Body parser helper (handles up to 50MB JSON bodies for high-res images)
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 60 * 1024 * 1024) { // 60MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    sendCors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  // API ROUTING
  if (pathname.startsWith('/api/')) {
    try {
      // GET /api/data
      if (req.method === 'GET' && pathname === '/api/data') {
        const db = readDb();
        return sendJson(res, 200, { success: true, data: db });
      }

      // POST /api/save (save all changes or partial state)
      if (req.method === 'POST' && pathname === '/api/save') {
        const body = await parseBody(req);
        const db = readDb();
        
        // Merge updates
        if (Array.isArray(body.polaroids)) db.polaroids = body.polaroids;
        if (body.editedExistingPolaroids) db.editedExistingPolaroids = Object.assign(db.editedExistingPolaroids || {}, body.editedExistingPolaroids);
        if (body.stories) db.stories = Object.assign(db.stories || {}, body.stories);
        if (Array.isArray(body.bucketList)) db.bucketList = body.bucketList;
        if (Array.isArray(body.promises)) db.promises = body.promises;
        if (body.centerpiece !== undefined) db.centerpiece = body.centerpiece;
        if (body.anniversary) db.anniversary = body.anniversary;

        writeDb(db);
        return sendJson(res, 200, { success: true, message: 'Saved successfully', updatedAt: db.updatedAt });
      }

      // POST /api/polaroid (add or update single polaroid)
      if (req.method === 'POST' && pathname === '/api/polaroid') {
        const body = await parseBody(req);
        if (!body || !body.src) {
          return sendJson(res, 400, { success: false, error: 'Missing image source' });
        }

        const db = readDb();
        if (!Array.isArray(db.polaroids)) db.polaroids = [];

        const existingIdx = db.polaroids.findIndex(p => p.id === body.id);
        if (existingIdx >= 0) {
          db.polaroids[existingIdx] = Object.assign(db.polaroids[existingIdx], body);
        } else {
          db.polaroids.unshift(body);
        }

        writeDb(db);
        return sendJson(res, 200, { success: true, polaroid: body });
      }

      // DELETE /api/polaroid/:id
      if (req.method === 'DELETE' && pathname.startsWith('/api/polaroid/')) {
        const id = pathname.replace('/api/polaroid/', '');
        const db = readDb();
        if (Array.isArray(db.polaroids)) {
          db.polaroids = db.polaroids.filter(p => p.id !== id);
        }
        writeDb(db);
        return sendJson(res, 200, { success: true, id });
      }

      // POST /api/reset (reset all memories to defaults)
      if (req.method === 'POST' && pathname === '/api/reset') {
        const defaultData = {
          polaroids: [],
          editedExistingPolaroids: {},
          stories: {},
          bucketList: [],
          promises: [],
          centerpiece: null,
          anniversary: "2024-04-22",
          updatedAt: Date.now()
        };
        writeDb(defaultData);
        return sendJson(res, 200, { success: true, message: 'Reset to default memories' });
      }

      return sendJson(res, 404, { success: false, error: 'API endpoint not found' });
    } catch (apiErr) {
      console.error('API Error:', apiErr);
      return sendJson(res, 500, { success: false, error: apiErr.message });
    }
  }

  // STATIC FILE SERVING
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, safePath);

  // Security: Prevent path traversal outside PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback for SPA routing if needed, or 404
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Development caching headers
    res.setHeader('Content-Type', contentType);
    sendCors(res);

    if (ext === '.html' || ext === '.js' || ext === '.css') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

ensureDb();

server.listen(PORT, () => {
  console.log(`🌸 Our Memory Lane server running at http://localhost:${PORT}`);
  console.log(`💾 REST APIs available at http://localhost:${PORT}/api/data`);
});
