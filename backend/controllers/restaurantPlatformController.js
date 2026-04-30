/*
  Restaurant ↔ Platform mappings controller.
  Mounted under /api/restaurant-platforms by routes/restaurantPlatformRoutes.js.
 */

const pool = require('../db');

/* GET /api/restaurant-platforms — list all mappings with names. */
async function listRestaurantPlatforms(req, res) {
  try {
    const sql = `
      SELECT
        rp.restaurant_id,
        r.name AS restaurant_name,
        rp.platform_id,
        p.platform_name,
        rp.external_restaurant_id
      FROM restaurant_platforms rp
      INNER JOIN restaurants r ON rp.restaurant_id = r.restaurant_id
      INNER JOIN platforms p ON rp.platform_id = p.platform_id
      ORDER BY r.name, p.platform_name
    `;
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/restaurant-platforms failed:', err);
    res.status(500).json({
      error: 'Failed to load restaurant-platform mappings',
      message: err.message,
    });
  }
}

module.exports = {
  listRestaurantPlatforms,
};
