module.exports.keyToUpperCase = (str) => str.replace(/(-|\s)[a-z]/ig, (m) => m[1].toUpperCase());
