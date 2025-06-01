import React from 'react';
import { StatementProps } from './types';
import { Context } from '../constructs';
import { dispatchExpression } from '../expressions/dispatchers';
import { dispatchStatement } from './dispatchers';
import * as utils from '../utils';

const { openParen, closeParen } = utils;

export const WhileStatement: React.FC<StatementProps> = (props) => {
  const context = new Context(props);
  const test = context.child('test').render(dispatchExpression);
  const body = context.child('body').render(dispatchStatement);
  return (
    <div className="statement while-statement">
      <span className="statement-header">
        <span className="keyword">while</span> {openParen}
        {test}
        {closeParen}
      </span>{' '}
      {body}
    </div>
  );
};
