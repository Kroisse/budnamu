import React, { ReactNode } from 'react';
import { StatementProps } from './types';
import { Context } from '../constructs';
import { dispatchExpression } from '../expressions/dispatchers';

function renderReturnStatement(keyword: string, argument: Context): ReactNode {
  const className = 'statement ' + keyword + '-statement';
  if (!argument.isEmpty()) {
    return (
      <div className={className}>
        <span className="keyword">{keyword}</span>{' '}
        {argument.render(dispatchExpression)};
      </div>
    );
  } else {
    return (
      <div className={className}>
        <span className="keyword">{keyword}</span>;
      </div>
    );
  }
}

export const ContinueStatement: React.FC<StatementProps> = (props) => {
  return renderReturnStatement(
    'continue',
    new Context(props).child('label'),
  );
};