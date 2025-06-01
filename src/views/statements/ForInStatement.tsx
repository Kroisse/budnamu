import React, { ReactNode } from 'react';
import { StatementProps } from './types';
import { Context } from '../constructs';
import { dispatchExpression } from '../expressions/dispatchers';
import { dispatchStatement } from './dispatchers';
import * as utils from '../utils';

const { openParen, closeParen } = utils;

// Import VariableDeclaration for the helper function
import { VariableDeclaration } from './VariableDeclaration';

// Helper function for rendering for statement init  
function renderForStatementInit(
  context: Context,
): ReactNode {
  if (context.isEmpty()) {
    return null;
  }
  if (context.node?.get('type') === 'VariableDeclaration') {
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

export const ForInStatement: React.FC<StatementProps> = (props) => {
  const context = new Context(props);
  const left = renderForStatementInit(context.child('left'));
  const right = context.child('right').render(dispatchExpression);
  const body = context.child('body').render(dispatchStatement);
  return (
    <div className="statement for-statement">
      <span className="statement-header">
        <span className="keyword">for</span> {openParen}
        {left} <span className="keyword">in</span> {right}
        {closeParen}
      </span>{' '}
      {body}
    </div>
  );
};