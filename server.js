const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const DEFAULT_ADMINS = [
  {
    usuario: '1069432843',
    password: 'BT1069432843',
    nombre: 'Wilson Varela',
    rol: 'Administrador Principal',
    createdAt: '2026-11-13T00:00:00.000Z'
  }
];

function ensureAdminsFile() {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const adminsPath = path.join(dataDir, 'admins.json');
  if (!fs.existsSync(adminsPath)) {
    fs.writeFileSync(adminsPath, JSON.stringify(DEFAULT_ADMINS, null, 2), 'utf-8');
  }
  return adminsPath;
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-GitHub-Token');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  const reqPath = req.url.split('?')[0];

  // Endpoint para leer organigrama desde /data/organigrama.json
  if (req.method === 'GET' && reqPath === '/api/organigrama') {
    try {
      const orgPath = path.join(__dirname, 'data', 'organigrama.json');
      if (fs.existsSync(orgPath)) {
        const raw = fs.readFileSync(orgPath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
        return res.end(raw);
      }
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ success: false, error: 'organigrama.json no encontrado' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }

  // Endpoint para leer usuarios administradores desde /data/admins.json
  if (req.method === 'GET' && reqPath === '/api/admins') {
    try {
      const adminsPath = ensureAdminsFile();
      const raw = fs.readFileSync(adminsPath, 'utf-8');
      const admins = JSON.parse(raw);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(Array.isArray(admins) ? admins : DEFAULT_ADMINS));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }

  // Endpoint para guardar usuarios administradores en /data/admins.json
  if (req.method === 'POST' && reqPath === '/api/save-admins') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const admins = JSON.parse(body);
        if (!Array.isArray(admins) || admins.length === 0) {
          throw new Error('Se requiere una lista válida de administradores.');
        }
        const sanitized = admins
          .filter(a => a && String(a.usuario || '').trim() && String(a.password || '').trim())
          .map(a => ({
            usuario: String(a.usuario).trim(),
            password: String(a.password).trim(),
            nombre: String(a.nombre || 'Administrador').trim(),
            rol: String(a.rol || 'Administrador').trim(),
            createdAt: a.createdAt || new Date().toISOString()
          }));
        if (sanitized.length === 0) {
          throw new Error('No hay administradores válidos para guardar.');
        }
        const adminsPath = ensureAdminsFile();
        fs.writeFileSync(adminsPath, JSON.stringify(sanitized, null, 2), 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, count: sanitized.length, path: 'data/admins.json' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Endpoint para guardar automáticamente el JSON en /data/organigrama.json
  if (req.method === 'POST' && reqPath === '/api/save-json') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const json = JSON.parse(body);
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        const filePath = path.join(dataDir, 'organigrama.json');
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, count: json.length, path: 'data/organigrama.json' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  let safePath = path.normalize(decodeURIComponent(req.url.split('?')[0]));
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';
  const filePath = path.join(__dirname, safePath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404 Not Found');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  ensureAdminsFile();
  console.log(`Servidor local del Organigrama Basetek S.A.S listo en http://localhost:${PORT}`);
});
