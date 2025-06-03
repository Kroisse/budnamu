import { JSX, ReactNode } from 'react';
import { Seq } from 'immutable';
import { Context } from './constructs';

// Import these at the top to avoid circular dependency issues
import { dispatchStatement } from './statements';
import { dispatchExpression, dispatchPattern } from './expressions/dispatchers';

export function commaSeparated(seq: Seq<number, ReactNode>): ReactNode[] {
  return seq
    .flatMap((v) => [v, ', '])
    .butLast()
    .toArray();
}

interface EncloseProps {
  children: ReactNode[];
  open?: ReactNode;
  close?: ReactNode;
}

export function Enclose({ children, open, close }: EncloseProps): JSX.Element {
  return (
    <>
      {open ?? <OpenParen />}
      {children}
      {close ?? <CloseParen />}
    </>
  );
}

interface FunctionHeaderProps {
  id: ReactNode;
  params: ReactNode[];
}

export function FunctionHeader({
  id,
  params,
}: FunctionHeaderProps): JSX.Element {
  return (
    <span className="function-header">
      <span className="keyword">function</span> {id}
      <OpenParen />
      {params}
      <CloseParen />
    </span>
  );
}

export function renderFunction(context: Context): JSX.Element {
  // Get identifier using dispatcher
  const id = context.child('id').render(dispatchExpression);

  const params = commaSeparated(
    context
      .child('params')
      .elements()
      .map((e) => e.render(dispatchPattern)),
  );
  const body = context.child('body').render(dispatchStatement);
  return (
    <>
      <FunctionHeader id={id} params={params} /> {body}
    </>
  );
}

export function OpenBrace(): JSX.Element {
  return <span className="paren-open">{'{'}</span>;
}

export function CloseBrace(): JSX.Element {
  return <span className="paren-close">{'}'}</span>;
}

export function OpenParen(): JSX.Element {
  return <span className="paren-open">{'('}</span>;
}

export function CloseParen(): JSX.Element {
  return <span className="paren-close">{')'}</span>;
}

export function OpenBracket(): JSX.Element {
  return <span className="paren-open">{'['}</span>;
}

export function CloseBracket(): JSX.Element {
  return <span className="paren-close">{']'}</span>;
}
