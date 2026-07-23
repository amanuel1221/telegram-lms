const isTeacher = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
      data: null,
    });
  }

  if (req.user.role !== 'teacher') {
    return res.status(403).json({
      success: false,
      message: 'Access denied.',
      data: null,
    });
  }

  next();
};

module.exports = isTeacher;