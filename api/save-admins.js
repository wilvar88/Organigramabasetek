const OWNER = 'wilvar88';
const REPO = 'Organigramabasetek';
const BRANCH = 'main';
const FILE_PATH = 'data/admins.json';

async function commitToGitHub(token, contentStr, message) {
  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'Organigrama-Basetek-Vercel',
    'Content-Type': 'application/json'
  };

  let sha;
  const getRes = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers });
  if (getRes.ok) {
    const existing = await getRes.json();
    sha = existing.sha;
  }

  const body = {
    message,
    content: Buffer.from(contentStr, 'utf-8').toString('base64'),
    branch: BRANCH
  };
  if (sha) body.sha = sha;

  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body)
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    throw new Error(`GitHub API ${putRes.status}: ${errText}`);
  }
  return putRes.json();
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-GitHub-Token');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const admins = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!Array.isArray(admins) || admins.length === 0) {
      return res.status(400).json({ success: false, error: 'Se requiere una lista válida de administradores.' });
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
      return res.status(400).json({ success: false, error: 'No hay administradores válidos para guardar.' });
    }

    const token = process.env.GITHUB_TOKEN || req.headers['x-github-token'];
    if (!token) {
      return res.status(501).json({
        success: false,
        needsToken: true,
        error: 'GITHUB_TOKEN no configurado en Vercel.'
      });
    }

    const jsonStr = JSON.stringify(sanitized, null, 2);
    const ghResult = await commitToGitHub(
      token,
      jsonStr,
      `Actualización de administradores (${sanitized.length} usuarios)`
    );

    return res.status(200).json({
      success: true,
      syncedGitHub: true,
      count: sanitized.length,
      path: FILE_PATH,
      commitSha: ghResult.commit?.sha || null
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

