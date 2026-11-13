const fs = require('fs');
const path = require('path');

const OWNER = 'wilvar88';
const REPO = 'Organigramabasetek';
const BRANCH = 'main';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  try {
    const ghUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/data/admins.json?ref=${BRANCH}`;
    const headers = {
      'Accept': 'application/vnd.github.v3.raw',
      'User-Agent': 'Organigrama-Basetek-Vercel'
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const ghRes = await fetch(ghUrl, { headers });
    if (ghRes.ok) {
      const data = await ghRes.json();
      if (Array.isArray(data) && data.length > 0) {
        return res.status(200).json(data);
      }
    }
  } catch (e) {}

  try {
    const localPath = path.join(process.cwd(), 'data', 'admins.json');
    if (fs.existsSync(localPath)) {
      const data = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
      if (Array.isArray(data) && data.length > 0) {
        return res.status(200).json(data);
      }
    }
  } catch (e) {}

  return res.status(200).json([
    {
      usuario: '1069432843',
      password: 'BT1069432843',
      nombre: 'Wilson Varela',
      rol: 'Administrador Principal',
      createdAt: '2026-11-13T00:00:00.000Z'
    }
  ]);
};

