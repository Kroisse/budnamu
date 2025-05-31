import React, { ReactNode, ReactElement } from 'react';
import { Seq } from 'immutable';
import { Context } from './constructs';

interface Utils {
  comma: (i: number) => ReactElement;
  commaSeparated: (seq: Seq<number, ReactNode>) => ReactNode[];
  enclose: (array: ReactNode[], parenOpen?: ReactNode, parenClose?: ReactNode) => void;
  renderFunction: (context: Context) => ReactElement;
  openBrace: ReactElement;
  closeBrace: ReactElement;
  openParen: ReactElement;
  closeParen: ReactElement;
  openBracket: ReactElement;
  closeBracket: ReactElement;
}

const utils: Utils = {
  comma(i: number) {
    return <span key={'comma' + i}>, </span>;
  },
  commaSeparated(seq: Seq<number, ReactNode>) {
    return seq
      .flatMap((v, k) => [v, utils.comma(k)])
      .butLast()
      .toArray();
  },
  enclose(array: ReactNode[], parenOpen?: ReactNode, parenClose?: ReactNode) {
    parenOpen = parenOpen || utils.openParen;
    parenClose = parenClose || utils.closeParen;
    array.unshift(parenOpen);
    array.push(parenClose);
  },
  renderFunction(context: Context) {
    // Circular imports resolved at the module level
    // TODO: should reflect ES6 features
    const { type } = context.node?.toObject() || {};
    const id = context.child('id').render(dispatchExpression);
    const params = utils.commaSeparated(
      context
        .child('params')
        .elements()
        .map((e) => e.render(dispatchPattern)),
    );
    let tag: string, className: string;
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
      body,
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
import { dispatchStatement } from './statements';
import { dispatchExpression, dispatchPattern } from './expressions';
