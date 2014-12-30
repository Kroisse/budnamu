var React = require("react");
var Immutable = require("immutable");
var {Context} = require("./constructs");
var {dispatchExpression, dispatchPattern} = require("./expressions");
var utils = require("./utils");
var {openBrace, closeBrace, openParen, closeParen} = utils;


var statements = {
    VariableDeclaration: React.createClass({
        getDefaultProps() {
            return {expression: false};
        },
        render() {
            var context = new Context(this.props);
            var declarations = context.child("declarations").elements().map(this.renderDeclaration);
            declarations = utils.commaSeparated(declarations);
            var expr = this.props.expression;
            var tag = expr ? "span" : "div";
            return React.createElement(tag, {className: (expr ? "expression" : "statement") + " variable-declaration"},
                <span className="keyword" style={{width: "5ex"}}>var </span>,
                <span className="declarations">{declarations}{expr ? "" : ";"}</span>);
        },
        renderDeclaration(context, i) {
            var id = context.child("id").render(dispatchPattern);
            var init = context.child("init").render(dispatchExpression);
            if (init !== null) {
                return <span className="declaration" key={i}>
                    {id} <span className="operator">{"="}</span> {init}
                </span>;
            } else {
                return <span className="declaration" key={i}>{id}</span>;
            }
        }
    }),
    FunctionDeclaration: React.createClass({
        render() {
            return utils.renderFunction(new Context(this.props));
        }
    }),
    ClassDeclaration: React.createClass({
        render() {
            var context = new Context(this.props);
            var id = context.child("id").render(dispatchExpression);
            var superClass = context.child("superClass");
            var body = context.child("body").child("body");
            if (!superClass.isEmpty()) {
                superClass = <span> <span className="keyword">extends</span> {superClass.render(dispatchExpression)}</span>;
            }
            return (
                <div className="statement class-declaration">
                    <span className="keyword">class</span> {id}{superClass} {utils.openBrace}
                        {body.blockConstruct()}
                    {utils.closeBrace}
                </div>
            );
        }
    }),
    MethodDefinition: React.createClass({
        render() {
            var context = new Context(this.props);
            var key = context.child("key").render(dispatchExpression);
            var value = context.child("value").render(dispatchExpression);
            return (
                <div className="statement method-definition">
                    {key}: {value}
                </div>
            );
        }
    }),
    ExpressionStatement: React.createClass({
        render() {
            return (
                <div className="statement expression-statement">
                    {new Context(this.props).child("expression").render(dispatchExpression)};
                </div>
            );
        }
    }),
    BlockStatement: React.createClass({
        render() {
            return (
                <span className="statement block-statement">{openBrace}
                    {new Context(this.props).child("body").blockConstruct()}
                {closeBrace}</span>
            );
        }
    }),
    IfStatement: React.createClass({
        render() {
            return React.createElement.bind(React, "div", {className: "statement if-statement"})
                .apply(null, this.renderIfClause(new Context(this.props)));
        },
        renderIfClause(context, depth=1) {
            var test = this._renderDepth(context.child("test"), dispatchExpression, depth);
            var consequent = this._renderDepth(context.child("consequent"), dispatchStatement, depth);
            var result = [<span className="keyword">if</span>, " ", openParen, test, closeParen, " ", consequent];
            Array.prototype.push.apply(result, this.renderElseClause(context.child("alternate"), depth));
            return result;
        },
        renderElseClause(context, depth=1) {
            if (context.isEmpty()) {
                return [];
            } else {
                var result = [" ", <span className="keyword">else</span>, " "];
                if (context.node.get("type") === "IfStatement") {
                    Array.prototype.push.apply(result, this.renderIfClause(context, depth + 1));
                } else {
                    var body = this._renderDepth(context, dispatchStatement, depth);
                    result.push(body);
                }
            }
            return result;
        },
        _renderDepth(context, dispatcher, depth) {
            return context.render((e, _, p) => dispatcher(e, p.takeLast(depth).join("."), p));
        }
    }),
    SwitchStatement: React.createClass({
        render() {
            var context = new Context(this.props);
            var discriminant = context.child("discriminant").render(dispatchExpression);
            var caseClauses = context.child("cases").elements().map(this.renderCase).toArray();
            return (
                <div className="statement switch-statement">
                    <span className="statement-header">
                        <span className="keyword">switch</span>{" "}{openParen}{discriminant}{closeParen}
                    </span>{" "}{openBrace}
                    <div className="switch-body">{caseClauses}</div>
                    <span className="statement-footer">{closeBrace}</span>
                </div>
            );
        },
        renderCase(caseClause, i) {
            var consequent = caseClause.child("consequent").blockConstruct();
            var header;
            var test = caseClause.child("test")
            if (!test.isEmpty()) {
                header = (
                    <div className="case-header">
                        <span className="keyword">case</span> {test.render(dispatchExpression)}:
                    </div>
                );
            } else {
                header = (
                    <div className="case-header">
                        <span className="keyword">default</span>:
                    </div>
                );
            }
            return (
                <div key={i} className="case-clause">
                    {header}
                    {consequent}
                </div>
            );
        }
    }),
    WhileStatement: React.createClass({
        render() {
            var context = new Context(this.props);
            var test = context.child("test").render(dispatchExpression);
            var body = context.child("body").render(dispatchStatement);
            return (
                <div className="statement while-statement">
                    <span className="statement-header">
                        <span className="keyword">while</span> {openParen}{test}{closeParen}
                    </span> {body}
                </div>
            );
        }
    }),
    DoWhileStatement: React.createClass({
        render() {
            var context = new Context(this.props);
            var test = context.child("test").render(dispatchExpression);
            var body = context.child("body").render(dispatchStatement);
            return (
                <div className="statement do-while-statement">
                    <span className="statement-header">
                        <span className="keyword">do</span>
                    </span> {body} <span className="statement-footer">
                        <span className="keyword">while</span> {openParen}{test}{closeParen};
                    </span>
                </div>
            );
        }
    }),
    ForStatement: React.createClass({
        render() {
            var context = new Context(this.props);
            var init = renderForStatementInit(context.child("init"));
            var test = context.child("test").render(dispatchExpression);
            var update = context.child("update").render(dispatchExpression);
            var body = context.child("body").render(dispatchStatement);
            return (
                <div className="statement for-statement">
                    <span className="statement-header">
                        <span className="keyword">for</span> {openParen}{init}; {test}; {update}{closeParen}
                    </span> {body}
                </div>
            );
        }
    }),
    ForInStatement: React.createClass({
        render() {
            var context = new Context(this.props);
            var left = renderForStatementInit(context.child("left"));
            var right = context.child("right").render(dispatchExpression);
            var body = context.child("body").render(dispatchStatement);
            return (
                <div className="statement for-statement">
                    <span className="statement-header">
                        <span className="keyword">for</span> {openParen}{left} <span className="keyword">in</span> {right}{closeParen}
                    </span> {body}
                </div>
            );
        }
    }),
    LabeledStatement: React.createClass({
        render() {
            var context = new Context(this.props);
            var label = context.child("label").render(dispatchExpression);
            var body = context.child("body").render(dispatchStatement);
            return (
                <div className="statement labeled-statement">
                    <span className="label">{label}</span>: {body}
                </div>
            );
        }
    }),
    TryStatement: React.createClass({
        render() {
            var context = new Context(this.props);
            var block = context.child("block").render(dispatchStatement);
            var catchClause = this.renderCatchClause(context.child("handler"));
            var guardedCatchClauses = context.child("guardedHandlers").elements().map(this.renderCatchClause);
            return (
                <div className="statement try-statement">
                    <span className="statement-header">
                        <span className="keyword">try</span>
                    </span> {block} {catchClause} {guardedCatchClauses} {this.renderFinallyClause(context)}
                </div>
            );
        },
        renderCatchClause(context, i) {
            var param = context.child("param").render(dispatchExpression);
            var body = context.child("body").render(dispatchStatement);
            return (
                <span key={i} className="catch-clause">
                    <span className="keyword">catch</span> ({param}) {body}
                </span>
            );
        },
        renderFinallyClause(context) {
            var finalizer = context.child("finalizer");
            if (finalizer.isEmpty()) {
                return null;
            }
            var finalizer = finalizer.render(dispatchStatement);
            return (<span className="finally-clause"> <span className="keyword">finally</span> {finalizer}</span>);
        }
    }),
    ReturnStatement: React.createClass({
        render() {
            return renderReturnStatement("return", new Context(this.props).child("argument"));
        }
    }),
    ThrowStatement: React.createClass({
        render() {
            return renderReturnStatement("throw", new Context(this.props).child("argument"));
        }
    }),
    ContinueStatement: React.createClass({
        render() {
            return renderReturnStatement("continue", new Context(this.props).child("label"));
        }
    }),
    BreakStatement: React.createClass({
        render() {
            return renderReturnStatement("break", new Context(this.props).child("label"));
        }
    })

};

function renderForStatementInit(context) {
    if (context.isEmpty()) {
        return null;
    }
    if (context.node.get("type") === "VariableDeclaration") {
        return <statements.VariableDeclaration key={context.key} expression={true} node={context.node} path={context.path} />;
    } else {
        return context.render(dispatchExpression);
    }
}

function renderReturnStatement(keyword, argument) {
    var className = "statement " + keyword + "-statement";
    if (!argument.isEmpty()) {
        return (
            <div className={className}>
                <span className="keyword">{keyword}</span> {argument.render(dispatchExpression)};
            </div>
        );
    } else {
        return (
            <div className={className}>
                <span className="keyword">{keyword}</span>;
            </div>
        );
    }
}

var UnknownStatement = React.createClass({
    render() {
        var e = JSON.stringify(this.props.node);
        return (
            <div className="statement unknown-statement">
                <span className="inner" onClick={this.inspect}>{"<<"} unknown: {e} {">>"}</span>
            </div>
        );
    },
    inspect() {
        console.log(this.props.node);
    }
});

function dispatchStatement(e, key, path) {
    var elem = statements[e.get("type")];
    if (typeof elem !== 'undefined') {
        return React.createFactory(elem)({key: key, node: e, path: path});
    } else {
        return <UnknownStatement key={key} node={e} path={path} />;
    }
}

module.exports = Immutable.Map(statements).merge({dispatchStatement: dispatchStatement}).toObject();
