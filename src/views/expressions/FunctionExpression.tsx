import React from 'react';
import { ExpressionProps } from './types';
import { Context } from '../constructs';
import * as utils from '../utils';

export const FunctionExpression: React.FC<ExpressionProps> = (props) => {
  return utils.renderFunction(new Context(props));
};
