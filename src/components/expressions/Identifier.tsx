import React, { ReactNode } from 'react';
import { ExpressionProps } from './types';

export const Identifier: React.FC<ExpressionProps> = ({ node }) => {
  // SWC uses 'value' field for Identifier
  const name = node.get('value') as ReactNode;

  return <span className="expression identifier">{name}</span>;
};
