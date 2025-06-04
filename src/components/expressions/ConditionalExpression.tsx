import React from 'react';
import { ExpressionProps } from './types';
import { Context } from '../constructs';
import { dispatchExpression } from './dispatchers';

export const ConditionalExpression: React.FC<ExpressionProps> = (props) => {
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
};
