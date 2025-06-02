import React from 'react';
import { StatementProps } from './types';
import { Context } from '../constructs';
import { renderFunction } from '../utils';

export const FunctionDeclaration: React.FC<StatementProps> = (props) => {
  return (
    <span className="statement function-declaration">
      {renderFunction(new Context(props))}
    </span>
  );
};
