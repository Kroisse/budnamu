import React from 'react';
import { Map } from 'immutable';
import { StatementProps } from './types';
import { Context } from '../constructs';
import {
  dispatchExpression,
  dispatchPattern,
} from '../expressions/dispatchers';
import { commaSeparated } from '../utils';

export const VariableDeclaration: React.FC<StatementProps> = ({
  expression = false,
  ...props
}) => {
  const context = new Context(props);

  // Get the declaration kind (var, let, const) from the AST node
  const kind =
    context.node && Map.isMap(context.node)
      ? (context.node.get('kind') as string) || 'var'
      : 'var';

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
  const declarationsList = commaSeparated(declarations);
  const tag: 'span' | 'div' = expression ? 'span' : 'div';
  return React.createElement(
    tag,
    {
      className:
        (expression ? 'expression' : 'statement') + ' variable-declaration',
    },
    <span className="keyword" style={{ width: '5ex' }}>
      {kind}{' '}
    </span>,
    <span className="declarations">
      {declarationsList}
      {expression ? '' : ';'}
    </span>,
  );
};
