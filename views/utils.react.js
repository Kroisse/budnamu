var React = require("react");


var utils = module.exports = {
    comma: function (i) {
        return <span key={"comma" + i}>, </span>;
    },
    commaSeparated: function (seq) {
        return seq.flatMap((v, k) => [v, utils.comma(k)]).butLast().toArray();
    },
    enclose: function (array, parenOpen, parenClose) {
        parenOpen = parenOpen || utils.openParen;
        parenClose = parenClose || utils.closeParen;
        array.unshift(parenOpen);
        array.push(parenClose);
    },
    renderFunction: function (context) {
        // TODO: should resolve this circular import
        var {dispatchStatement} = require('./statements'),
            {dispatchExpression, dispatchPattern} = require('./expressions');
        // TODO: should reflect ES6 features
        var {type, expression} = context.node.toObject();
        var id = context.child("id").render(dispatchExpression);
        var params = utils.commaSeparated(context.child("params").elements().map(e => e.render(dispatchPattern)));
        var tag, className;
        if (type.match(/Expression$/)) {
            tag = "span";
            className = "expression function-expression";
        } else {
            tag = "div";
            className = "statement function-declaration";
        }
        var body = context.child("body").render(dispatchStatement);
        return React.createElement(
            tag, {className: className},
            <span className="function-header">
                <span className="keyword">function</span> {id || ""}
                {utils.openParen}{params}{utils.closeParen}
            </span>, " ", {body}
        );
    },
    openBrace: <span className="paren-open">{"{"}</span>,
    closeBrace: <span className="paren-close">{"}"}</span>,
    openParen: <span className="paren-open">{"("}</span>,
    closeParen: <span className="paren-close">{")"}</span>,
    openBracket: <span className="paren-open">{"["}</span>,
    closeBracket: <span className="paren-close">{"]"}</span>
};
