/**
 * Defines the Parser class which parses math expressions to an AST
 */

function isAlpha(token) {
    return (token >= 'a' && token <= 'z');
}

function isNumber(token) {
    return /\d*\.\d+|\d+\.\d*|\d+/.test(token);
}

var namespace = 'http://www.w3.org/1998/Math/MathML';
var tokenRegex = /([a-z])|([\(\)\+\-\/\*\^\=])|(\d*\.\d+|\d+\.\d*|\d+)/g;

class Parser {

    parse(input) {
        this.i = 0;
        // TODO: switch from 'match' to 'exec' so that an invalid input raises an error
        this.tokens = input.match(tokenRegex);

        return this.equation();
    }

    equation() {
        var left = this.expression();
        var token = this.tokens[this.i++];
        if (token === '=') {
            var right = this.expression();
            return {
                type: 'Equation',
                left,
                right
            };
        }
        return left;
    }

    expression() {
        var tokens = this.tokens;
        var children = [];

        children.push(this.term());

        var token = tokens[this.i++];
        while (token === '+' || token === '-') {
            children.push(token);
            children.push(this.term());
            token = tokens[this.i++];
        }
        this.i--;   // backup

        if (children.length === 1) {
            return children[0];
        }

        return {
            type: 'Expression',
            children
        }
    };

    term() {
        var tokens = this.tokens;
        var children = [];

        children.push(this.factor());

        var token = tokens[this.i++];

        // TODO handle numerator and quotient separately
        while (token === '*' || token === '/' || token === '(' || isAlpha(token)) {
            if (token === '(') {
                // TODO display concern
                children.push('*');

                var expr = this.expression();
                token = tokens[this.i++];
                if (token !== ')') {
                    throw 'expected )';
                }
                children.push(expr);

            } else if (isAlpha(token)) {  // TODO: figure out why we can't let factor() handle this
                children.push('*');
                this.i--; // put the alpha back on so factor() can deal with it
                // TODO: create a peek function to handle this more elegantly
                children.push(this.factor());
                token = tokens[this.i++];
            } else {
                children.push(token);   // either a '*' or '/'
                children.push(this.factor());
                token = tokens[this.i++];
            }

            if (this.i > tokens.length) {
                break;
            }
        }
        this.i--;

        if (children.length === 1) {
            return children[0];
        }

        return {
            type: 'Term',
            children
        };
    }


    factor() {
        var tokens = this.tokens;
        var token = tokens[this.i++];
        var sign = '';

        // TODO: think about multiple unary minuses
        if (token === '+' || token === '-') {
            sign = token;
            token = tokens[this.i++];
        }


        var base, exp;

        // TODO wrap these tokens in the correct structs
        if (isAlpha(token)) {
            base = {
                type: 'Variable',
                name: token
            };
        } else if (isNumber(token)) {
            base = {
                type: 'Number',
                value: token
            }
        } else if (token === '(') {
            base = this.expression();
            token = tokens[this.i++];
            if (token !== ')') {
                throw 'expected )';
            }
        }

        // TODO handle exponents separately
        if (tokens[this.i++] === '^') {
            exp = this.factor();
            return {
                type: 'Power',
                base,
                exp
            };
        } else {
            this.i--;

            var factor = base;

            if (factor.type == 'Expression' || factor.type == 'Variable') {
                factor = {
                    type: 'Negation',
                    inner: factor
                };
            } else if (factor.type == 'Number') {
                factor.value = -factor.value;
            }

            return factor;
        }
    };
}

module.exports = Parser;
