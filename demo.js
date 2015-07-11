var Parser = require("./index.js");

var math = "1 + 2 * -(3 - 4)/(10*(x + y))";

var parser = new Parser();
var ast = parser.parse(math);

console.log(math);
console.log(JSON.stringify(ast, null, 4));
