import React, { ReactNode } from 'react';
import { ExpressionProps } from './types';
import { Context } from '../constructs';
import { dispatchExpression } from './dispatchers';
import { Map } from 'immutable';

function renderUnaryExpression(className: string, context: Context): ReactNode {
  const op = Map.isMap(context.node) ? context.node.get('operator') : null;
  const argument = context.child('argument').render(dispatchExpression);
  className = 'expression ' + className;
  if (op === 'typeof') {
    return (
      <span className={className}>
        <span className="keyword operator">{op}</span> {argument}
      </span>
    );
  } else if (Map.isMap(context.node) && context.node.get('prefix')) {
    return (
      <span className={className}>
        <span className="operator">{op}</span>
        {argument}
      </span>
    );
  } else {
    return (
      <span className={className}>
        {argument}
        <span className="operator">{op}</span>
      </span>
    );
  }
}

export const UnaryExpression: React.FC<ExpressionProps> = (props) => {
  return renderUnaryExpression('unary-expression', new Context(props));
};
