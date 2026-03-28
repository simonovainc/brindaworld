const supabase = require('../lib/supabase');
const { pool } = require('../db');

/**
 * verifyToken  — Express middleware
 * Validates the Supabase JWT from the Authorization header,
 * then attaches the MySQL user record to req.user.
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.slice(7);

    // Validate JWT with Supabase
    const { data: { user: supaUser }, error } = await supabase.auth.getUser(token);
    if (error || !supaUser) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Look up the matching MySQL user
    const [rows] = await pool.query(
      `SELECT id, email, role, first_name, last_name, supabase_id
       FROM users
       WHERE supabase_id = ? AND deleted_at IS NULL
       LIMIT 1`,
      [supaUser.id]
    );

    if (!rows.length) {
      return res.status(401).json({ error: 'User account not found' });
    }

    req.user = {
      id:          rows[0].id,
      supabaseId:  rows[0].supabase_id,
      email:       rows[0].email,
      role:        rows[0].role,
      firstName:   rows[0].first_name,
      lastName:    rows[0].last_name,
    };

    next();
  } catch (err) {
    console.error('[auth middleware]', err.message);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = { verifyToken };
