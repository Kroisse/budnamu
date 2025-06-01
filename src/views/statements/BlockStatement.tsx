import React from 'react';
import { StatementProps } from './types';
import { Context } from '../constructs';
import { dispatchStatement } from './dispatchers';
import { openBrace, closeBrace } from '../utils';

export const BlockStatement: React.FC<StatementProps> = (props) => {
  return (
    <span className="statement block-statement">
      {openBrace}
      {new Context(props).child('body').blockConstruct(dispatchStatement)}
      {closeBrace}
    </span>
  );
};
