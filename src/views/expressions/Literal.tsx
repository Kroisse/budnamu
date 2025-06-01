import React, { ReactNode } from 'react';
import { ExpressionProps } from './types';

export const Literal: React.FC<ExpressionProps> = ({ node }) => {
  const type = typeof node.get('value');
  return (
    <span className={'expression literal literal-' + type}>
      {node.get('raw') as ReactNode}
    </span>
  );
};
