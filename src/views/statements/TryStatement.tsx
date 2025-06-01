import React, { ReactNode } from 'react';
import { StatementProps } from './types';
import { Context } from '../constructs';
import { dispatchExpression } from '../expressions/dispatchers';
import { dispatchStatement } from './dispatchers';

export const TryStatement: React.FC<StatementProps> = (props) => {
  const context = new Context(props);

  const renderCatchClause = (context: Context, i: number): ReactNode => {
    const param = context.child('param').render(dispatchExpression);
    const body = context.child('body').render(dispatchStatement);
    return (
      <span key={i} className="catch-clause">
        <span className="keyword">catch</span> ({param}) {body}
      </span>
    );
  };

  const renderFinallyClause = (context: Context): ReactNode => {
    const finalizer = context.child('finalizer');
    if (finalizer.isEmpty()) {
      return null;
    }
    const finalizerRendered = finalizer.render(dispatchStatement);
    return (
      <span className="finally-clause">
        {' '}
        <span className="keyword">finally</span> {finalizerRendered}
      </span>
    );
  };

  const block = context.child('block').render(dispatchStatement);
  const catchClause = renderCatchClause(context.child('handler'), 0);
  const guardedCatchClauses = context
    .child('guardedHandlers')
    .elements()
    .map(renderCatchClause);
  return (
    <div className="statement try-statement">
      <span className="statement-header">
        <span className="keyword">try</span>
      </span>{' '}
      {block} {catchClause} {guardedCatchClauses.toArray()}{' '}
      {renderFinallyClause(context)}
    </div>
  );
};
