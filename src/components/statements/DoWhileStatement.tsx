import React from 'react';
import { StatementProps } from './types';
import { Context } from '../constructs';
import { dispatchExpression } from '../expressions/dispatchers';
import { dispatchStatement } from './dispatchers';
import { OpenParen, CloseParen } from '../utils';

export const DoWhileStatement: React.FC<StatementProps> = (props) => {
  const context = new Context(props);
  const test = context.child('test').render(dispatchExpression);
  const body = context.child('body').render(dispatchStatement);
  return (
    <div className="statement do-while-statement">
      <span className="statement-header">
        <span className="keyword">do</span>
      </span>{' '}
      {body}{' '}
      <span className="statement-footer">
        <span className="keyword">while</span> <OpenParen />
        {test}
        <CloseParen />
      </span>
    </div>
  );
};
