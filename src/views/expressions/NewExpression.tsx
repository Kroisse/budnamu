import React from 'react';
import { ExpressionProps } from './types';
import { Context } from '../constructs';
import * as utils from '../utils';
import { dispatchExpression } from './dispatchers';

export const NewExpression: React.FC<ExpressionProps> = (props) => {
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
};
