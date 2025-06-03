import React from 'react';
import { ExpressionProps } from './types';
import { Context } from '../constructs';
import { RenderFunction } from '../utils/RenderFunction';

export const FunctionExpression: React.FC<ExpressionProps> = (props) => {
  return (
    <span className="expression function-expression">
      <RenderFunction context={new Context(props)} />
    </span>
  );
};
