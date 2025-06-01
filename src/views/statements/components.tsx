import React, { ReactNode } from 'react';
import {
  Context,
  ImmutableNode,
  ImmutablePath,
  Dispatcher,
} from '../constructs';
import {
  dispatchExpression,
  dispatchPattern,
} from '../expressions/dispatchers';
import * as utils from '../utils';
import { StatementComponent } from './types';

// Import all individual statement components
import { VariableDeclaration } from './VariableDeclaration';
import { FunctionDeclaration } from './FunctionDeclaration';
import { ClassDeclaration } from './ClassDeclaration';
import { MethodDefinition } from './MethodDefinition';
import { ExpressionStatement } from './ExpressionStatement';
import { BlockStatement } from './BlockStatement';
import { IfStatement } from './IfStatement';
import { SwitchStatement } from './SwitchStatement';
import { WhileStatement } from './WhileStatement';
import { DoWhileStatement } from './DoWhileStatement';
import { ForStatement } from './ForStatement';
import { ForInStatement } from './ForInStatement';
import { LabeledStatement } from './LabeledStatement';
import { TryStatement } from './TryStatement';
import { ReturnStatement } from './ReturnStatement';
import { ThrowStatement } from './ThrowStatement';
import { ContinueStatement } from './ContinueStatement';
import { BreakStatement } from './BreakStatement';

const { openBrace, closeBrace, openParen, closeParen } = utils;

// Helper functions
function renderForStatementInit(
  context: Context,
  dispatchers: ComponentsWithDispatchers,
): ReactNode {
  if (context.isEmpty()) {
    return null;
  }
  if (context.node?.get('type') === 'VariableDeclaration') {
    const VariableDeclaration = dispatchers.statements.VariableDeclaration;
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

function renderReturnStatement(keyword: string, argument: Context): ReactNode {
  const className = 'statement ' + keyword + '-statement';
  if (!argument.isEmpty()) {
    return (
      <div className={className}>
        <span className="keyword">{keyword}</span>{' '}
        {argument.render(dispatchExpression)};
      </div>
    );
  } else {
    return (
      <div className={className}>
        <span className="keyword">{keyword}</span>;
      </div>
    );
  }
}

// Types for components with dispatchers
interface ComponentsWithDispatchers {
  statements: Record<string, StatementComponent>;
  dispatchStatement: Dispatcher;
}

// Factory function to create statement components
export function createStatementComponents(
  dispatchers: ComponentsWithDispatchers,
): Record<string, StatementComponent> {
  const { dispatchStatement } = dispatchers;

  const statements: Record<string, StatementComponent> = {
    VariableDeclaration,
    FunctionDeclaration,
    ClassDeclaration,
    MethodDefinition,
    ExpressionStatement,
    BlockStatement,
    IfStatement,
    SwitchStatement,
    WhileStatement,
    DoWhileStatement,
    ForStatement,
    ForInStatement,
    LabeledStatement,
    TryStatement,
    ReturnStatement,
    ThrowStatement,
    ContinueStatement,
    BreakStatement,
  };

  return statements;
}
