import React, { ReactNode } from 'react';
import { ExpressionProps } from './types';

export const Identifier: React.FC<ExpressionProps> = ({ node }) => {
  // Handle both standard AST (name) and SWC TypeScript AST (value)
  const name = (node.get('name') ?? node.get('value')) as ReactNode;

  return <span className="expression identifier">{name}</span>;
};
