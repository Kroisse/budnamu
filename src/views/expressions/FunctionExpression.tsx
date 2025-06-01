import React from 'react';
import { ExpressionProps } from './types';
import { Context } from '../constructs';
import { renderFunction } from '../utils';

export const FunctionExpression: React.FC<ExpressionProps> = (props) => {
  return renderFunction(new Context(props));
};
