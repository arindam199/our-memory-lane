// Vercel Serverless Function: POST/DELETE /api/polaroid
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    const polaroid = req.body || {};
    return res.status(200).json({
      success: true,
      polaroid,
      message: 'Polaroid saved to memory vault'
    });
  }

  if (req.method === 'DELETE') {
    return res.status(200).json({
      success: true,
      message: 'Polaroid removed'
    });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
};
