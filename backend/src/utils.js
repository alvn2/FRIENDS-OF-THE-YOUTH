/**
 * Wraps async route handlers to catch errors.
 * @param {function} fn - The async controller function.
 * @returns {function} - The wrapped function.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

