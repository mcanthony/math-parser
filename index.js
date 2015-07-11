require("babel-core/register");

var Parser = require("./parser.js");

var math = "1 + 2 * -(3 - 4)/(x + y)";

var parser = new Parser();
var ast = parser.parse(math);

console.log(math);
console.log(JSON.stringify(ast, null, 4));
