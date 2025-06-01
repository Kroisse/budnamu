import React from 'react';
import { StatementProps } from './types';
import { Context } from '../constructs';
import { dispatchExpression } from '../expressions/dispatchers';
import { dispatchStatement } from './dispatchers';
import * as utils from '../utils';

export const ClassDeclaration: React.FC<StatementProps> = (props) => {
  const context = new Context(props);
  const id = context.child('id').render(dispatchExpression);
  const superClassContext = context.child('superClass');
  const body = context.child('body').child('body');
  const superClass = !superClassContext.isEmpty() ? (
    <span>
      {' '}
      <span className="keyword">extends</span>{' '}
      {superClassContext.render(dispatchExpression)}
    </span>
  ) : null;
  return (
    <div className="statement class-declaration">
      <span className="keyword">class</span> {id}
      {superClass} {utils.openBrace}
      {body.blockConstruct(dispatchStatement)}
      {utils.closeBrace}
    </div>
  );
};