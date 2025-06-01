import React from 'react';
import { StatementProps } from './types';
import { Context } from '../constructs';
import { dispatchExpression } from '../expressions/dispatchers';
import { dispatchStatement } from './dispatchers';

export const LabeledStatement: React.FC<StatementProps> = (props) => {
  const context = new Context(props);
  const label = context.child('label').render(dispatchExpression);
  const body = context.child('body').render(dispatchStatement);
  return (
    <div className="statement labeled-statement">
      <span className="label">{label}</span>: {body}
    </div>
  );
};