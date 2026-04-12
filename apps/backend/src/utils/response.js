function success(res, data, meta) {
  if (meta) {
    return res.json({ data, meta });
  }

  return res.json({ data });
}

function failure(res, status, code, message) {
  return res.status(status).json({
    error: {
      code,
      message,
    },
  });
}

module.exports = {
  success,
  failure,
};