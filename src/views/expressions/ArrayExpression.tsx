import React from 'react';
import { ExpressionProps } from './types';
import { Context } from '../constructs';
import { openBracket, closeBracket, commaSeparated } from '../utils';
import { dispatchExpression } from './dispatchers';

export const ArrayExpression: React.FC<ExpressionProps> = (props) => {
  const context = new Context(props);
  const elements = commaSeparated(
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
};
