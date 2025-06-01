import React from 'react';
import { StatementProps } from './types';
import { Context } from '../constructs';
import { dispatchExpression } from '../expressions/dispatchers';

export const MethodDefinition: React.FC<StatementProps> = (props) => {
  const context = new Context(props);
  const key = context.child('key').render(dispatchExpression);
  const value = context.child('value').render(dispatchExpression);
  return (
    <div className="statement method-definition">
      {key}: {value}
    </div>
  );
};