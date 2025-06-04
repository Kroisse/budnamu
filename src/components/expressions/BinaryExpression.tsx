import React, { ReactNode } from 'react';
import { ExpressionProps } from './types';
import { Context } from '../constructs';
import { dispatchExpression } from './dispatchers';

export const BinaryExpression: React.FC<ExpressionProps> = (props) => {
  const context = new Context(props);
  const op = props.node.get('operator') as ReactNode;
  const left = context.child('left').render(dispatchExpression);
  const right = context.child('right').render(dispatchExpression);
  return (
    <span className="expression binary-expression">
      {left} <span className="operator">{op}</span> {right}
    </span>
  );
};
