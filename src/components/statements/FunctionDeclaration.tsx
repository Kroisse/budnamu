import React from 'react';
import { StatementProps } from './types';
import { Context } from '../constructs';
import { RenderFunction } from '../utils/RenderFunction';

export const FunctionDeclaration: React.FC<StatementProps> = (props) => {
  return (
    <span className="statement function-declaration">
      <RenderFunction context={new Context(props)} />
    </span>
  );
};
