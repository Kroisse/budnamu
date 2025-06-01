import React from 'react';
import { StatementProps } from './types';
import { Context } from '../constructs';
import { dispatchExpression } from '../expressions/dispatchers';

export const ExpressionStatement: React.FC<StatementProps> = (props) => {
  return (
    <div className="statement expression-statement">
      {new Context(props).child('expression').render(dispatchExpression)};
    </div>
  );
};