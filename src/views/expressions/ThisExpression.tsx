import React from 'react';
import { ExpressionProps } from './types';

export const ThisExpression: React.FC<ExpressionProps> = () => {
  return (
    <span className="expression this-expression">
      <span className="keyword">this</span>
    </span>
  );
};
