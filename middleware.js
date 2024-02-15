const logUserAgent = (req, res, next) => {
  console.log("User Agent:", req.headers["user-agent"]);
  next();
};

module.exports = {
  logUserAgent,
};
