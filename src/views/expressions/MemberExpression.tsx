import React from 'react';
import { ExpressionProps } from './types';
import { Context } from '../constructs';
import * as utils from '../utils';
import { dispatchExpression } from './dispatchers';

const { openBracket, closeBracket } = utils;

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
