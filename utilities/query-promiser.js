let Model;
const Promiser = (method, opts={}, opts1=null, opts2=null) => {
  return new Promise((resolve, reject) => {
    Model[method](opts, opts1, opts2)
      .then(data => resolve(data))
      .catch(reject);
  });
};

module.exports = (model) => {
  Model = model;
  return Promiser;
};


