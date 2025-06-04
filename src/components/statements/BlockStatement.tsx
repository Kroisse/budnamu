import React from 'react';
import { StatementProps } from './types';
import { Context } from '../constructs';
import { dispatchStatement } from './dispatchers';
import { OpenBrace, CloseBrace } from '../utils';

export const BlockStatement: React.FC<StatementProps> = (props) => {
  return (
    <span className="statement block-statement">
      <OpenBrace />
      {new Context(props).child('stmts').blockConstruct(dispatchStatement)}
      <CloseBrace />
    </span>
  );
};
