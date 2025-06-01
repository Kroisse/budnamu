import React from 'react';
import { Map } from 'immutable';
import { StatementProps } from './types';
import {
  Context,
  ImmutableNode,
  ImmutablePath,
  Dispatcher,
} from '../constructs';
import { dispatchExpression } from '../expressions/dispatchers';
import { dispatchStatement } from './dispatchers';
import { openParen, closeParen } from '../utils';

export const IfStatement: React.FC<StatementProps> = (props) => {
  const _renderDepth = (
    context: Context,
    dispatcher: Dispatcher,
    depth: number,
  ) => {
    return context.render(
      (e: ImmutableNode, _: string | number, p: ImmutablePath) => {
        const key = p.takeLast(depth).join('.');
        return dispatcher(e, key, p);
      },
    );
  };

  const renderElseClause = (context: Context, depth = 1): React.ReactNode => {
    if (context.isEmpty()) {
      return null;
    }

    if (Map.isMap(context.node) && context.node.get('type') === 'IfStatement') {
      return (
        <>
          {' '}
          <span className="keyword">else</span>{' '}
          {renderIfClause(context, depth + 1)}
        </>
      );
    } else {
      const body = _renderDepth(context, dispatchStatement, depth);
      return (
        <>
          {' '}
          <span className="keyword">else</span> {body}
        </>
      );
    }
  };

  const renderIfClause = (context: Context, depth = 1): React.ReactNode => {
    const test = _renderDepth(context.child('test'), dispatchExpression, depth);
    const consequent = _renderDepth(
      context.child('consequent'),
      dispatchStatement,
      depth,
    );

    return (
      <>
        <span className="keyword">if</span> {openParen}
        {test}
        {closeParen} {consequent}
        {renderElseClause(context.child('alternate'), depth)}
      </>
    );
  };

  return (
    <div className="statement if-statement">
      {renderIfClause(new Context(props))}
    </div>
  );
};
