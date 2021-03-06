window.addEventListener("DOMContentLoaded", function () {
    var geval = safeEval;

    var repl = new CodeMirrorREPL("arena-textarea", {
        mode: "javascript",
        theme: "twilight"
    });

    repl.print([
        "/*",
        "",
        "Learn Programming By Playing Game",
        "",
        "Supported commands:",
        "",
        "me.left()",
        "me.right()",
        "me.up()",
        "me.down()",
        "me.shoot()",
        "me.shootUp()",
        "me.shootDown()",
        "me.shootLeft()",
        "me.shootRight()",
        "me.stop() -- stop all actions",
        "or like use if,while,for",
        "You can chain commands, i.e.:",
        "",
        "me.up().shootLeft()",
        "","*/"].join("\n")
    );

    window.print = function (message) {
        repl.print(message, "message");
    };

    repl.isBalanced = function (code) {
        var length = code.length;
        var delimiter = '';
        var brackets = [];
        var matching = {
            ')': '(',
            ']': '[',
            '}': '{'
        };

        for (var i = 0; i < length; i++) {
            var char = code.charAt(i);

            switch (delimiter) {
            case "'":
            case '"':
            case '/':
                switch (char) {
                case delimiter:
                    delimiter = "";
                    break;
                case "\\":
                    i++;
                }

                break;
            case "//":
                if (char === "\n") delimiter = "";
                break;
            case "/*":
                if (char === "*" && code.charAt(++i) === "/") delimiter = "";
                break;
            default:
                switch (char) {
                case "'":
                case '"':
                    delimiter = char;
                    break;
                case "/":
                    var lookahead = code.charAt(++i);
                    delimiter = char;

                    switch (lookahead) {
                    case "/":
                    case "*":
                        delimiter += lookahead;
                    }

                    break;
                case "(":
                case "[":
                case "{":
                    brackets.push(char);
                    break;
                case ")":
                case "]":
                case "}":
                    if (!brackets.length || matching[char] !== brackets.pop()) {
                        repl.print(new SyntaxError("Unexpected closing bracket: '" + char + "'"), "error");
                        return null;
                    }
                }
            }
        }

        return brackets.length ? false : true;
    };

    repl.eval = function (code) {
        try {
            if (isExpression(code)) {
                geval("__expression__ = " + code);
                window.data = undefined;
                express(__expression__);
            } else geval(code);
        } catch (error) {
            repl.print(error, "error");
        }
    };

    function isExpression(code) {
        if (/^\s*function\s/.test(code)) return false;

        try {
            Function("return " + code);
            return true;
        } catch (error) {
            return false;
        }
    }

    function express(value) {
        if (value === null) var type = "Null";
        else if (typeof value === "Undefined") var type = "Undefined";
        else var type = Object.prototype.toString.call(value).slice(8, -1);

        switch (type) {
        case "String":
            value = '"' + value.replace('\\', '\\\\').replace('\0', '\\0').replace('\n', '\\n').replace('\r', '\\r').replace('\t', '\\t').replace('\v', '\\v').replace('"', '\\"') + '"';
        case "Number":
        case "Boolean":
        case "Function":
        case "Undefined":
        case "Null":
            repl.print(value);
            break;
        case "Object":
        case "Array":
            try {
                repl.print(JSON.stringify(value, 4));
            } catch (e) {
                if (e instanceof TypeError) {
                    repl.print(value);                    
                } else {
                    throw e;
                }
            }
            break;
        default:
            repl.print(value, "error");
        }
    }

    $('.logo-small').addClass('animated swing permanent');
}, false);
