module.exports.upperCaser = (str) => str[0].toLowerCase()+str.replace(/(-|\s)[a-z]/ig, (m) => m[1].toUpperCase()).substring(1);
