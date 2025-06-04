import React from 'react';
import { ImmutableNode, ImmutablePath } from '../constructs';

interface UnknownExpressionProps {
  node: ImmutableNode;
  key?: string | number;
  path?: ImmutablePath;
}

export const UnknownExpression: React.FC<UnknownExpressionProps> = ({
  node,
}) => {
  const inspect = () => {
    console.log(node);
  };

  const e = JSON.stringify(node);
  return (
    <span key="0" className="expression unknown-expression" onClick={inspect}>
      {'<<'} unknown: {e} {'>>'}
    </span>
  );
};
