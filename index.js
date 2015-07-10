require("babel-core/register");

var Parser = require("./parser.js");

var math = "1 + 2 * (3 - 4)";

var parser = new Parser();
var ast = parser.parse(math);

console.log(ast);
