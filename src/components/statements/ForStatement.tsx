import React, { ReactNode } from 'react';
import { Map } from 'immutable';
import { StatementProps } from './types';
import { Context } from '../constructs';
import { dispatchExpression } from '../expressions/dispatchers';
import { dispatchStatement } from './dispatchers';
import { OpenParen, CloseParen } from '../utils';

// Import VariableDeclaration for the helper function
import { VariableDeclaration } from './VariableDeclaration';

// Helper function for rendering for statement init
function renderForStatementInit(context: Context): ReactNode {
  if (context.isEmpty()) {
    return null;
  }
  if (
    Map.isMap(context.node) &&
    context.node.get('type') === 'VariableDeclaration'
  ) {
    return (
      <VariableDeclaration
        key={context.key}
        expression={true}
        node={context.node}
        path={context.path}
      />
    );
  } else {
    return context.render(dispatchExpression);
  }
}

export const ForStatement: React.FC<StatementProps> = (props) => {
  const context = new Context(props);
  const init = renderForStatementInit(context.child('init'));
  const test = context.child('test').render(dispatchExpression);
  const update = context.child('update').render(dispatchExpression);
  const body = context.child('body').render(dispatchStatement);
  return (
    <div className="statement for-statement">
      <span className="statement-header">
        <span className="keyword">for</span> <OpenParen />
        {init}; {test}; {update}
        <CloseParen />
      </span>{' '}
      {body}
    </div>
  );
};
