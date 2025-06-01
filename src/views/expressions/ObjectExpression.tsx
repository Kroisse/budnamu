import React from 'react';
import { ExpressionProps } from './types';
import { Context } from '../constructs';
import * as utils from '../utils';
import { dispatchExpression } from './dispatchers';

const { openBrace, closeBrace } = utils;

export const ObjectExpression: React.FC<ExpressionProps> = (props) => {
  const context = new Context(props);
  const properties = utils.commaSeparated(
    context
      .child('properties')
      .elements()
      .map((e, i) => {
        const key = e.child('key').render(dispatchExpression);
        const value = e.child('value').render(dispatchExpression);
        return (
          <span key={i} className="property">
            {key}: {value}
          </span>
        );
      }),
  );
  return (
    <span className="expression object-expression">
      {openBrace}
      <span className="properties">{properties}</span>
      {closeBrace}
    </span>
  );
};
