/**
 * Global error handler — final safety net.
 *
 * Mount last (after all routes) in server.js. Controllers currently handle
 * their own errors with 500 JSON; this middleware catches anything that
 * slips through, including malformed JSON in request bodies.
 */

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  console.error('Unhandled error:', err);

  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Invalid JSON in request body',
      message: err.message,
    });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: status === 500 ? 'Internal Server Error' : err.message,
    message: err.message,
  });
}

module.exports = errorHandler;
