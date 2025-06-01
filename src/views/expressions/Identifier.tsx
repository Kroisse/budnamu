import React, { ReactNode } from 'react';
import { ExpressionProps } from './types';

export const Identifier: React.FC<ExpressionProps> = ({ node }) => {
  return (
    <span className="expression identifier">
      {node.get('name') as ReactNode}
    </span>
  );
};
