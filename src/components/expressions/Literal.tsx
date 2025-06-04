import React, { ReactNode } from 'react';
import { ExpressionProps } from './types';

export const Literal: React.FC<ExpressionProps> = ({ node }) => {
  const value = node.get('value');
  const type = typeof value;
  const raw = node.get('raw');

  // If raw is not provided, generate it from value
  let displayValue: ReactNode;
  if (raw != null) {
    displayValue = raw;
  } else {
    // Generate raw representation from value
    if (type === 'string') {
      displayValue = JSON.stringify(value);
    } else if (value === null) {
      displayValue = 'null';
    } else if (value === undefined) {
      displayValue = 'undefined';
    } else if (type === 'object') {
      // For objects, use JSON.stringify to avoid [object Object]
      displayValue = JSON.stringify(value);
    } else {
      // For numbers, booleans, etc. - safe to use String()
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      displayValue = String(value);
    }
  }

  return (
    <span className={'expression literal literal-' + type}>{displayValue}</span>
  );
};
