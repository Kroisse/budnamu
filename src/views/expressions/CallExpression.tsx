import React from 'react';
import { ExpressionProps } from './types';
import { Context } from '../constructs';
import * as utils from '../utils';
import { dispatchExpression } from './dispatchers';

const { openParen, closeParen } = utils;

export const CallExpression: React.FC<ExpressionProps> = (props) => {
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
};
