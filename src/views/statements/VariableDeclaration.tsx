import React from 'react';
import { StatementProps } from './types';
import { Context } from '../constructs';
import {
  dispatchExpression,
  dispatchPattern,
} from '../expressions/dispatchers';
import * as utils from '../utils';

export const VariableDeclaration: React.FC<StatementProps> = ({
  expression = false,
  ...props
}) => {
  const context = new Context(props);

  const renderDeclaration = (context: Context, i: number) => {
    const id = context.child('id').render(dispatchPattern);
    const init = context.child('init').render(dispatchExpression);
    if (init !== null) {
      return (
        <span className="declaration" key={i}>
          {id} <span className="operator">{'='}</span> {init}
        </span>
      );
    } else {
      return (
        <span className="declaration" key={i}>
          {id}
        </span>
      );
    }
  };

  const declarations = context
    .child('declarations')
    .elements()
    .map(renderDeclaration);
  const declarationsList = utils.commaSeparated(declarations);
  const tag: 'span' | 'div' = expression ? 'span' : 'div';
  return React.createElement(
    tag,
    {
      className:
        (expression ? 'expression' : 'statement') + ' variable-declaration',
    },
    <span className="keyword" style={{ width: '5ex' }}>
      var{' '}
    </span>,
    <span className="declarations">
      {declarationsList}
      {expression ? '' : ';'}
    </span>,
  );
};
