import React from 'react';
import { Map, List } from 'immutable';
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

  // Get declarations directly from the node since Context.child doesn't handle Lists
  const declarationsValue =
    context.node && Map.isMap(context.node)
      ? context.node.get('declarations')
      : null;

  let declarationsList: React.ReactNode[] = [];

  if (List.isList(declarationsValue)) {
    const declarationElements = declarationsValue
      .map((decl, i) => {
        if (!Map.isMap(decl)) return null;

        // Create contexts for id and init
        const idNode = decl.get('id');
        const initNode = decl.get('init');

        const idContext = new Context({
          node: Map.isMap(idNode) ? idNode : null,
          path: context.path.push('declarations').push(i).push('id'),
        });

        const initContext = new Context({
          node: Map.isMap(initNode) ? initNode : null,
          path: context.path.push('declarations').push(i).push('init'),
        });

        const id = idContext.render(dispatchPattern);
        const init = initContext.render(dispatchExpression);

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
      })
      .filter(Boolean);

    declarationsList = [...commaSeparated(declarationElements.toSeq())];
  }
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
