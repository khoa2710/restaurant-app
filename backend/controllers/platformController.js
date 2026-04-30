/* Platform controller — request handling, validation, SQL queries, JSON. */

const pool = require('../db');

/** GET /api/platforms — list all platforms. */
async function listPlatforms(req, res) {
  try {
    const sql = `
      SELECT platform_id, platform_name, api_url
      FROM platforms
      ORDER BY platform_name
    `;
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/platforms failed:', err);
    res.status(500).json({
      error: 'Failed to load platforms',
      message: err.message,
    });
  }
}

module.exports = {
  listPlatforms,
};
