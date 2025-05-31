import React from 'react';

const utils = {
  comma(i) {
    return <span key={'comma' + i}>, </span>;
  },
  commaSeparated(seq) {
    return seq
      .flatMap((v, k) => [v, utils.comma(k)])
      .butLast()
      .toArray();
  },
  enclose(array, parenOpen, parenClose) {
    parenOpen = parenOpen || utils.openParen;
    parenClose = parenClose || utils.closeParen;
    array.unshift(parenOpen);
    array.push(parenClose);
  },
  renderFunction(context) {
    // Circular imports resolved at the module level
    // TODO: should reflect ES6 features
    const { type } = context.node.toObject();
    const id = context.child('id').render(dispatchExpression);
    const params = utils.commaSeparated(
      context
        .child('params')
        .elements()
        .map((e) => e.render(dispatchPattern)),
    );
    var tag, className;
    if (type.match(/Expression$/)) {
      tag = 'span';
      className = 'expression function-expression';
    } else {
      tag = 'div';
      className = 'statement function-declaration';
    }
    const body = context.child('body').render(dispatchStatement);
    return React.createElement(
      tag,
      { className: className },
      <span className="function-header">
        <span className="keyword">function</span> {id || ''}
        {utils.openParen}
        {params}
        {utils.closeParen}
      </span>,
      ' ',
      { body },
    );
  },
  openBrace: <span className="paren-open">{'{'}</span>,
  closeBrace: <span className="paren-close">{'}'}</span>,
  openParen: <span className="paren-open">{'('}</span>,
  closeParen: <span className="paren-close">{')'}</span>,
  openBracket: <span className="paren-open">{'['}</span>,
  closeBracket: <span className="paren-close">{']'}</span>,
};

export default utils;
export const {
  comma,
  commaSeparated,
  enclose,
  renderFunction,
  openBrace,
  closeBrace,
  openParen,
  closeParen,
  openBracket,
  closeBracket,
} = utils;

// Import these after utils is defined to avoid circular dependency issues
import { dispatchStatement } from './statements.jsx';
import { dispatchExpression, dispatchPattern } from './expressions.jsx';
