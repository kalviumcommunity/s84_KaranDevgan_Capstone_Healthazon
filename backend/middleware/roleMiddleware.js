// backend/middleware/roleMiddleware.js

export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Access denied: ${allowedRoles.join(" or ")} only` });
    }
    next();
  };
};
