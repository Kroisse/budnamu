import React from 'react';
import { ExpressionProps } from './types';
import { Context } from '../constructs';
import * as utils from '../utils';
import { dispatchExpression } from './dispatchers';

const { openParen, closeParen } = utils;

export const SequenceExpression: React.FC<ExpressionProps> = (props) => {
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
};
