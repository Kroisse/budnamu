import { JSX, PropsWithChildren, ReactElement, ReactNode } from 'react';
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

export function enclose(
  array: ReactNode[],
  parenOpen?: ReactNode,
  parenClose?: ReactNode,
): void {
  parenOpen = parenOpen ?? openParen;
  parenClose = parenClose ?? closeParen;
  array.unshift(parenOpen);
  array.push(parenClose);
}

export function renderFunction(context: Context): JSX.Element {
  // Circular imports resolved at the module level
  // TODO: should reflect ES6 features
  const nodeObj = context.node?.toObject() ?? {};
  const type = typeof nodeObj.type === 'string' ? nodeObj.type : '';

  // Get identifier using dispatcher
  const id = context.child('id').render(dispatchExpression);

  const params = commaSeparated(
    context
      .child('params')
      .elements()
      .map((e) => e.render(dispatchPattern)),
  );
  const Tag = type.endsWith('Expression')
    ? ExpressionWrapper
    : StatementWrapper;
  const body = context.child('body').render(dispatchStatement);
  return (
    <Tag>
      <span className="function-header">
        <span className="keyword">function</span> {id}
        {openParen}
        {params}
        {closeParen}
      </span>{' '}
      {body}
    </Tag>
  );
}

function ExpressionWrapper({ children }: PropsWithChildren): ReactElement {
  return <span className="expression function-expression">{children}</span>;
}

function StatementWrapper({ children }: PropsWithChildren): ReactElement {
  return <span className="statement function-declaration">{children}</span>;
}

export const openBrace = <span className="paren-open">{'{'}</span>;
export const closeBrace = <span className="paren-close">{'}'}</span>;
export const openParen = <span className="paren-open">{'('}</span>;
export const closeParen = <span className="paren-close">{')'}</span>;
export const openBracket = <span className="paren-open">{'['}</span>;
export const closeBracket = <span className="paren-close">{']'}</span>;
