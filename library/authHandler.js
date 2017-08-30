module.exports = (req, res, next) => {
  // if url includes users and method post dont check authorization
    // next
  // else check auth token
    // if success next
    // else res.end 401 unauthorized
  next();
};
