module.exports.healthCheck = (req, res, next) => {
  const getMemoryUsage = () => {
    const used = process.memoryUsage();
    for (key in used) {
      used[key] = Math.round(used[key] / 1024 / 1024 * 100) / 100;
    }
    return used;
  };

  const system = {
    uptime: process.uptime(),
    nodeVersion: process.version,
    memoryUsage: getMemoryUsage()
  };

  res.json(system);
};
