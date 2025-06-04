import React from 'react';
import { ExpressionProps } from './types';
import { Context } from '../constructs';
import { OpenParen, CloseParen, commaSeparated } from '../utils';
import { dispatchExpression } from './dispatchers';

export const CallExpression: React.FC<ExpressionProps> = (props) => {
  const context = new Context(props);
  const callee = context.child('callee').render(dispatchExpression);
  const args = commaSeparated(
    context
      .child('arguments')
      .elements()
      .map((e) => {
        // SWC wraps arguments in {spread: null, expression: {...}}
        const expressionChild = e.child('expression');
        return !expressionChild.isEmpty()
          ? expressionChild.render(dispatchExpression)
          : e.render(dispatchExpression);
      }),
  );
  return (
    <span className="expression call-expression">
      {callee}
      <OpenParen />
      {args}
      <CloseParen />
    </span>
  );
};
