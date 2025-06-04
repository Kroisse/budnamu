import { ReactNode } from 'react';
import { OpenParen, CloseParen } from './brackets';

interface FunctionHeaderProps {
  id: ReactNode;
  params: ReactNode;
}

export function FunctionHeader({ id, params }: FunctionHeaderProps) {
  return (
    <span className="function-header">
      <span className="keyword">function</span> {id}
      <OpenParen />
      {params}
      <CloseParen />
    </span>
  );
}
