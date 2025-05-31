import React, { ReactNode } from 'react';
import { Map } from 'immutable';
import { Context, ImmutableNode, ImmutablePath, Dispatcher } from './constructs';
import * as utils from './utils';
const {
  openBrace,
  closeBrace,
  openParen,
  closeParen,
  openBracket,
  closeBracket,
} = utils;

interface ExpressionProps {
  node: ImmutableNode;
  path: ImmutablePath;
  key?: string | number;
}

type ExpressionComponent = React.FC<ExpressionProps>;

const expressions: Record<string, ExpressionComponent> = {
  Literal: ({ node }) => {
    const type = typeof node.get('value');
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
    const context = new Context(props);
    const properties = utils.commaSeparated(
      context
        .child('properties')
        .elements()
        .map((e, i) => {
          const key = e.child('key').render(dispatchExpression);
          const value = e.child('value').render(dispatchExpression);
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
    const context = new Context(props);
    const elements = utils.commaSeparated(
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
    const className = 'expression member-expression';
    const context = new Context(props);
    const object = context.child('object').render(dispatchExpression);
    const property = context.child('property').render(dispatchExpression);
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
    const context = new Context(props);
    const callee = context.child('callee').render(dispatchExpression);
    const args = utils.commaSeparated(
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
    const context = new Context(props);
    const callee = context.child('callee').render(dispatchExpression);
    const args = utils.commaSeparated(
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
    const context = new Context(props);
    const op = props.node.get('operator');
    const left = context.child('left').render(dispatchExpression);
    const right = context.child('right').render(dispatchExpression);
    return (
      <span className="expression binary-expression">
        {left} <span className="operator">{op}</span> {right}
      </span>
    );
  },
  LogicalExpression: (props) => {
    const context = new Context(props);
    const op = props.node.get('operator');
    const left = context.child('left').render(dispatchExpression);
    const right = context.child('right').render(dispatchExpression);
    return (
      <span className="expression logical-expression">
        {left} <span className="operator">{op}</span> {right}
      </span>
    );
  },
  ConditionalExpression: (props) => {
    const context = new Context(props);
    const test = context.child('test').render(dispatchExpression);
    const consequent = context.child('consequent').render(dispatchExpression);
    const alternate = context.child('alternate').render(dispatchExpression);
    return (
      <span className="expression conditional-expression">
        {test} <span className="operator">?</span> {consequent}{' '}
        <span className="operator">:</span> {alternate}
      </span>
    );
  },
  AssignmentExpression: (props) => {
    const context = new Context(props);
    const op = props.node.get('operator');
    const left = context.child('left').render(dispatchExpression);
    const right = context.child('right').render(dispatchExpression);
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
    const context = new Context(props);
    const elements = utils.commaSeparated(
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

function renderUnaryExpression(className: string, context: Context): ReactNode {
  const op = context.node.get('operator');
  const argument = context.child('argument').render(dispatchExpression);
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

const patterns: Record<string, ExpressionComponent> = (Map(expressions)
  .merge({
    ObjectPattern: (props) => {
      const context = new Context(props);
      const properties = utils.commaSeparated(
        context
          .child('properties')
          .elements()
          .map((e, i) => {
            const key = e.child('key').render(dispatchExpression);
            if (e.node.get('shorthand')) {
              return (
                <span key={i} className="property">
                  {key}
                </span>
              );
            } else {
              const value = e.child('value').render(dispatchPattern);
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
      const context = new Context(props);
      const elements = utils.commaSeparated(
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
  .toObject()) as Record<string, ExpressionComponent>;

const UnknownExpression: React.FC<{ node: ImmutableNode }> = ({ node }) => {
  const inspect = () => {
    console.log(node);
  };

  const e = JSON.stringify(node);
  return (
    <span key="0" className="expression unknown-expression" onClick={inspect}>
      {'<<'} unknown: {e} {'>>'}
    </span>
  );
};

const dispatchExpression: Dispatcher = (e, key, path) => {
  const elem = expressions[e.get('type')];
  if (typeof elem !== 'undefined') {
    return React.createElement(elem, { key: key, node: e, path: path });
  } else {
    return <UnknownExpression key={key} node={e} path={path} />;
  }
}

const dispatchPattern: Dispatcher = (e, key, path) => {
  const elem = patterns[e.get('type')];
  if (typeof elem !== 'undefined') {
    return React.createElement(elem, { key: key, node: e, path: path });
  } else {
    return <UnknownExpression key={key} node={e} path={path} />;
  }
}

export default {
  ...expressions,
  ...patterns,
  dispatchExpression,
  dispatchPattern,
};

export { dispatchExpression, dispatchPattern };
