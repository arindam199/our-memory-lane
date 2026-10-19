// Vercel Serverless Function: GET /api/data
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

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

  return res.status(200).json({ success: true, data: defaultData });
};
