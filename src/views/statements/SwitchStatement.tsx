import React, { ReactNode } from 'react';
import { StatementProps } from './types';
import { Context } from '../constructs';
import { dispatchExpression } from '../expressions/dispatchers';
import { dispatchStatement } from './dispatchers';
import { OpenBrace, CloseBrace, OpenParen, CloseParen } from '../utils';

export const SwitchStatement: React.FC<StatementProps> = (props) => {
  const context = new Context(props);

  const renderCase = (caseClause: Context, i: number): ReactNode => {
    const consequent = caseClause
      .child('consequent')
      .blockConstruct(dispatchStatement);
    let header;
    const test = caseClause.child('test');
    if (!test.isEmpty()) {
      header = (
        <div className="case-header">
          <span className="keyword">case</span>{' '}
          {test.render(dispatchExpression)}:
        </div>
      );
    } else {
      header = (
        <div className="case-header">
          <span className="keyword">default</span>:
        </div>
      );
    }
    return (
      <div key={i} className="case-clause">
        {header}
        {consequent}
      </div>
    );
  };

  const discriminant = context.child('discriminant').render(dispatchExpression);
  const caseClauses = context
    .child('cases')
    .elements()
    .map(renderCase)
    .toArray();
  return (
    <div className="statement switch-statement">
      <span className="statement-header">
        <span className="keyword">switch</span> <OpenParen />
        {discriminant}
        <CloseParen />
      </span>{' '}
      <OpenBrace />
      <div className="switch-body">{caseClauses}</div>
      <span className="statement-footer">
        <CloseBrace />
      </span>
    </div>
  );
};
