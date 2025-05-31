import React from 'react';
import Immutable from 'immutable';
import { Context } from './constructs.jsx';
import * as utils from './utils.jsx';
const {
  openBrace,
  closeBrace,
  openParen,
  closeParen,
  openBracket,
  closeBracket,
} = utils;

const expressions = {
  Literal: ({ node }) => {
    var type = typeof node.get('value');
    return (
      <span className={'expression literal literal-' + type}>
        {node.get('raw')}
      </span>
    );
  },
  Identifier: ({ node }) => {
    return <span className="expression identifier">{node.get('name')}</span>;
  },
  ThisExpression: () => {
    return (
      <span className="expression this-expression">
        <span className="keyword">this</span>
      </span>
    );
  },
  ObjectExpression: (props) => {
    var context = new Context(props);
    var properties = utils.commaSeparated(
      context
        .child('properties')
        .elements()
        .map((e, i) => {
          var key = e.child('key').render(dispatchExpression);
          var value = e.child('value').render(dispatchExpression);
          return (
            <span key={i} className="property">
              {key}: {value}
            </span>
          );
        }),
    );
    return (
      <span className="expression object-expression">
        {openBrace}
        <span className="properties">{properties}</span>
        {closeBrace}
      </span>
    );
  },
  ArrayExpression: (props) => {
    var context = new Context(props);
    var elements = utils.commaSeparated(
      context
        .child('elements')
        .elements()
        .map((e) => e.render(dispatchExpression)),
    );
    return (
      <span className="expression array-expression">
        {openBracket}
        {elements}
        {closeBracket}
      </span>
    );
  },
  MemberExpression: (props) => {
    var className = 'expression member-expression';
    var context = new Context(props);
    var object = context.child('object').render(dispatchExpression);
    var property = context.child('property').render(dispatchExpression);
    if (props.node.get('computed')) {
      return (
        <span className={className}>
          {object}
          {openBracket}
          {property}
          {closeBracket}
        </span>
      );
    } else {
      return (
        <span className={className}>
          {object}
          <span className="operator">.</span>
          {property}
        </span>
      );
    }
  },
  CallExpression: (props) => {
    var context = new Context(props);
    var callee = context.child('callee').render(dispatchExpression);
    var args = utils.commaSeparated(
      context
        .child('arguments')
        .elements()
        .map((e) => e.render(dispatchExpression)),
    );
    return (
      <span className="expression call-expression">
        {callee}
        {openParen}
        {args}
        {closeParen}
      </span>
    );
  },
  NewExpression: (props) => {
    var context = new Context(props);
    var callee = context.child('callee').render(dispatchExpression);
    var args = utils.commaSeparated(
      context
        .child('arguments')
        .elements()
        .map((e) => e.render(dispatchExpression)),
    );
    utils.enclose(args);
    return (
      <span className="expression new-expression">
        <span className="keyword">new</span> {callee}
        {args.length > 0 ? args : ''}
      </span>
    );
  },
  UnaryExpression: (props) => {
    return renderUnaryExpression('unary-expression', new Context(props));
  },
  BinaryExpression: (props) => {
    var context = new Context(props);
    var op = props.node.get('operator');
    var left = context.child('left').render(dispatchExpression);
    var right = context.child('right').render(dispatchExpression);
    return (
      <span className="expression binary-expression">
        {left} <span className="operator">{op}</span> {right}
      </span>
    );
  },
  LogicalExpression: (props) => {
    var context = new Context(props);
    var op = props.node.get('operator');
    var left = context.child('left').render(dispatchExpression);
    var right = context.child('right').render(dispatchExpression);
    return (
      <span className="expression logical-expression">
        {left} <span className="operator">{op}</span> {right}
      </span>
    );
  },
  ConditionalExpression: (props) => {
    var context = new Context(props);
    var test = context.child('test').render(dispatchExpression);
    var consequent = context.child('consequent').render(dispatchExpression);
    var alternate = context.child('alternate').render(dispatchExpression);
    return (
      <span className="expression conditional-expression">
        {test} <span className="operator">?</span> {consequent}{' '}
        <span className="operator">:</span> {alternate}
      </span>
    );
  },
  AssignmentExpression: (props) => {
    var context = new Context(props);
    var op = props.node.get('operator');
    var left = context.child('left').render(dispatchExpression);
    var right = context.child('right').render(dispatchExpression);
    return (
      <span className="expression assignment-expression">
        {left} <span className="operator">{op}</span> {right}
      </span>
    );
  },
  UpdateExpression: (props) => {
    return renderUnaryExpression('update-expression', new Context(props));
  },
  FunctionExpression: (props) => {
    return utils.renderFunction(new Context(props));
  },
  SequenceExpression: (props) => {
    var context = new Context(props);
    var elements = utils.commaSeparated(
      context
        .child('expressions')
        .elements()
        .map((e) => e.render(dispatchExpression)),
    );
    return (
      <span className="expression sequence-expression">
        {openParen}
        {elements}
        {closeParen}
      </span>
    );
  },
};

function renderUnaryExpression(className, context) {
  var op = context.node.get('operator');
  var argument = context.child('argument').render(dispatchExpression);
  className = 'expression ' + className;
  if (op === 'typeof') {
    return (
      <span className={className}>
        <span className="keyword operator">{op}</span> {argument}
      </span>
    );
  } else if (context.node.get('prefix')) {
    return (
      <span className={className}>
        <span className="operator">{op}</span>
        {argument}
      </span>
    );
  } else {
    return (
      <span className={className}>
        {argument}
        <span className="operator">{op}</span>
      </span>
    );
  }
}

const patterns = Immutable.Map(expressions)
  .merge({
    ObjectPattern: (props) => {
      var context = new Context(props);
      var properties = utils.commaSeparated(
        context
          .child('properties')
          .elements()
          .map((e, i) => {
            var key = e.child('key').render(dispatchExpression);
            if (e.node.get('shorthand')) {
              return (
                <span key={i} className="property">
                  {key}
                </span>
              );
            } else {
              var value = e.child('value').render(dispatchPattern);
              return (
                <span key={i} className="property">
                  {key}: {value}
                </span>
              );
            }
          }),
      );
      return (
        <span className="expression object-pattern">
          {openBrace}
          <span className="properties">{properties}</span>
          {closeBrace}
        </span>
      );
    },
    ArrayPattern: (props) => {
      var context = new Context(props);
      var elements = utils.commaSeparated(
        context
          .child('elements')
          .elements()
          .map((e) => e.render(dispatchPattern)),
      );
      return (
        <span className="expression array-pattern">
          {openBracket}
          {elements}
          {closeBracket}
        </span>
      );
    },
  })
  .toObject();

const UnknownExpression = ({ node }) => {
  const inspect = () => {
    console.log(node);
  };

  var e = JSON.stringify(node);
  return (
    <span key="0" className="expression unknown-expression" onClick={inspect}>
      {'<<'} unknown: {e} {'>>'}
    </span>
  );
};

function dispatchExpression(e, key, path) {
  var elem = expressions[e.get('type')];
  if (typeof elem !== 'undefined') {
    return React.createElement(elem, { key: key, node: e, path: path });
  } else {
    return <UnknownExpression key={key} node={e} path={path} />;
  }
}

function dispatchPattern(e, key, path) {
  var elem = patterns[e.get('type')];
  if (typeof elem !== 'undefined') {
    return React.createElement(elem, { key: key, node: e, path: path });
  } else {
    return <UnknownExpression key={key} node={e} path={path} />;
  }
}

export default Immutable.Map(expressions)
  .merge(patterns, {
    dispatchExpression: dispatchExpression,
    dispatchPattern: dispatchPattern,
  })
  .toObject();

export { dispatchExpression, dispatchPattern };
