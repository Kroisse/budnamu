import { ReactNode } from 'react';
import { OpenParen, CloseParen } from './brackets';

interface EncloseProps {
  children: ReactNode | ReactNode[];
  open?: ReactNode;
  close?: ReactNode;
}

export function Enclose({ children, open, close }: EncloseProps) {
  return (
    <>
      {open ?? <OpenParen />}
      {children}
      {close ?? <CloseParen />}
    </>
  );
}
