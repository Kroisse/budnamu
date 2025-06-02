import React from 'react';
import { ExpressionProps } from './types';
import { Context } from '../constructs';
import { OpenParen, CloseParen, commaSeparated } from '../utils';
import { dispatchExpression } from './dispatchers';

export const SequenceExpression: React.FC<ExpressionProps> = (props) => {
  const context = new Context(props);
  const elements = commaSeparated(
    context
      .child('expressions')
      .elements()
      .map((e) => e.render(dispatchExpression)),
  );
  return (
    <span className="expression sequence-expression">
      <OpenParen />
      {elements}
      <CloseParen />
    </span>
  );
};
