import React from 'react';
import { ExpressionProps } from './types';
import { Context } from '../constructs';
import { openBracket, closeBracket } from '../utils';
import { dispatchExpression } from './dispatchers';

export const MemberExpression: React.FC<ExpressionProps> = (props) => {
  const className = 'expression member-expression';
  const context = new Context(props);
  const object = context.child('object').render(dispatchExpression);
  const property = context.child('property').render(dispatchExpression);
  if (props.node.get('computed')) {
    return (
      <span className={className}>
        {object}
        {openBracket}
        {property}
        {closeBracket}
      </span>
    );
  } else {
    return (
      <span className={className}>
        {object}
        <span className="operator">.</span>
        {property}
      </span>
    );
  }
};
