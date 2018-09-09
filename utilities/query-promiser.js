module.exports = (Model) => {
  // how to handle when methods like findoneandupdate and has extra params
  function Promiser(method, opts) {
    return new Promise((resolve, reject) => {
      Model[method](opts)
        .then(data => resolve(data))
        .catch(reject);
    });
  };

  return Promiser;
};
