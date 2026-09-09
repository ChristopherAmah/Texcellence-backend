const containsUnsafeKey = (value) => {
  if (!value || typeof value !== 'object') return false;

  return Object.entries(value).some(([key, nestedValue]) => (
    key.startsWith('$') || key.includes('.') || containsUnsafeKey(nestedValue)
  ));
};

export const sanitizeRequest = (req, res, next) => {
  if (containsUnsafeKey(req.body) || containsUnsafeKey(req.query) || containsUnsafeKey(req.params)) {
    return res.status(400).json({ success: false, message: 'Request contains unsupported fields.' });
  }

  return next();
};
