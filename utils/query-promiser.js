const { makeErr, logger } = require('./');

module.exports = (Model) => {
  // how to handle when methods like findoneandupdate and has extra params
  function Promiser(method, opts) {
		return new Promise(async (resolve, reject) => {
			try {
				let qR = await Model[method](opts);
				resolve(qR);
			} catch(err) {
				logger.error(`Error executing ${method} on model ${Model.modelName} ${err.stack || err.message}`);
				reject(makeErr(`Unknown server error, review request params and resources are available`));
			}
		});
  };

  return Promiser;
};
